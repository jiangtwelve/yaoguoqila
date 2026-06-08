const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const command = db.command;

exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();
    if (!OPENID) {
      throw new Error('无法获取用户身份');
    }

    const action = event.action;
    const payload = event.payload || {};

    switch (action) {
      case 'home.getFamilyHome':
        return getFamilyHome(OPENID);
      case 'user.updateProfile':
        return updateProfile(OPENID, payload);
      case 'family.createFamily':
        return createFamily(OPENID, payload);
      case 'item.getFormOptions':
        return getItemFormOptions(OPENID);
      case 'item.listItems':
        return listItems(OPENID, payload.familyId, payload.search);
      case 'item.getItemDetail':
        return getItemDetail(OPENID, payload.itemId);
      case 'item.createItem':
        return createItem(OPENID, payload.familyId, payload.input);
      case 'item.updateItem':
        return updateItem(OPENID, payload.itemId, payload.input);
      case 'item.consumeItem':
        return consumeItem(OPENID, payload.itemId);
      case 'item.deleteItem':
        await deleteItem(OPENID, payload.itemId);
        return null;
      default:
        throw new Error(`未知云函数动作：${action || 'empty'}`);
    }
  } catch (error) {
    return {
      error: error.message || '云函数执行失败'
    };
  }
};

async function getFamilyHome(openId) {
  const userDoc = await ensureUser(openId);
  const families = await listFamilies(openId);
  const currentFamily = await getCurrentFamily(userDoc, families, openId);

  if (!currentFamily) {
    return {
      user: normalizeUser(userDoc, openId),
      currentFamily: null,
      families,
      locations: [],
      items: []
    };
  }

  return {
    user: normalizeUser(userDoc, openId),
    currentFamily,
    families,
    locations: await listLocations(currentFamily.id),
    items: await listItems(openId, currentFamily.id, '')
  };
}

async function updateProfile(openId, input) {
  const displayName = (input.displayName || input.nickname || '').trim();
  if (!displayName) {
    throw new Error('昵称不能为空');
  }

  await ensureUser(openId);
  await db.collection('users').doc(openId).update({
    data: {
      displayName,
      nickname: displayName,
      updatedAt: nowIso()
    }
  });

  const user = await db.collection('users').doc(openId).get();
  return normalizeUser(user.data, openId);
}

async function createFamily(openId, input) {
  const name = (input.name || '').trim();
  if (!name) {
    throw new Error('家庭名称不能为空');
  }

  const userDoc = await ensureUser(openId);
  const dup = await db.collection('families').where({ creatorId: openId, name }).get();
  if (dup.data.length > 0) {
    throw new Error('已存在同名家庭');
  }

  const now = nowIso();
  const family = {
    name,
    avatarUrl: null,
    creatorId: openId,
    createdBy: openId,
    memberIds: [openId],
    inviteToken: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`,
    inviteTokenExpire: new Date(Date.now() + 48 * 60 * 60 * 1000),
    createdAt: now,
    updatedAt: now
  };

  const addRes = await db.collection('families').add({ data: family });
  await db.collection('users').doc(openId).update({
    data: {
      familyIds: command.push(addRes._id),
      currentFamilyId: userDoc.currentFamilyId || addRes._id,
      updatedAt: now
    }
  });

  return normalizeFamily({ ...family, _id: addRes._id });
}

async function getItemFormOptions(openId) {
  const userDoc = await ensureUser(openId);
  const families = await listFamilies(openId);
  const family = await getCurrentFamily(userDoc, families, openId);

  return {
    family,
    locations: family ? await listLocations(family.id) : []
  };
}

async function listItems(openId, familyId, search) {
  if (!familyId) {
    return [];
  }

  await assertFamilyMember(openId, familyId);
  const res = await db.collection('items')
    .where({ familyId })
    .orderBy('expiresAt', 'asc')
    .get();

  const keyword = (search || '').trim().toLowerCase();
  return res.data
    .map(normalizeItem)
    .filter(item => item.status !== 'consumed')
    .filter(item => {
      if (!keyword) return true;
      return [item.name, item.locationName, item.note]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(keyword));
    })
    .sort(sortItemByStatusAndDate);
}

async function getItemDetail(openId, itemId) {
  const itemDoc = await getItemWithAccess(openId, itemId);
  const item = normalizeItem(itemDoc);
  let family = null;

  try {
    const familyRes = await db.collection('families').doc(item.familyId).get();
    family = normalizeFamily(familyRes.data);
  } catch (error) {}

  return {
    item,
    family,
    locationName: item.locationName
  };
}

async function createItem(openId, familyId, input) {
  if (!familyId) {
    throw new Error('家庭信息缺失');
  }
  await assertFamilyMember(openId, familyId);
  validateItemInput(input);

  const now = nowIso();
  const item = buildItemDocument({
    familyId,
    input,
    createdBy: openId,
    createdAt: now,
    updatedAt: now
  });

  const addRes = await db.collection('items').add({ data: item });
  await bumpLocationHistory(familyId, input.locationName);
  return normalizeItem({ ...item, _id: addRes._id });
}

async function updateItem(openId, itemId, input) {
  const previous = await getItemWithAccess(openId, itemId);
  validateItemInput(input);

  const updateData = buildItemDocument({
    familyId: previous.familyId,
    input,
    createdBy: previous.createdBy,
    createdAt: previous.createdAt,
    updatedAt: nowIso()
  });

  await db.collection('items').doc(itemId).update({ data: updateData });
  await bumpLocationHistory(previous.familyId, input.locationName);
  return normalizeItem({ ...previous, ...updateData, _id: itemId });
}

async function consumeItem(openId, itemId) {
  const item = await getItemWithAccess(openId, itemId);
  const updateData = {
    status: 'consumed',
    consumedAt: nowIso(),
    updatedAt: nowIso()
  };

  await db.collection('items').doc(itemId).update({ data: updateData });
  return normalizeItem({ ...item, ...updateData, _id: itemId });
}

async function deleteItem(openId, itemId) {
  await getItemWithAccess(openId, itemId);
  await db.collection('items').doc(itemId).remove();
}

async function ensureUser(openId) {
  try {
    const existing = await db.collection('users').doc(openId).get();
    if (existing.data) {
      return existing.data;
    }
  } catch (error) {}

  const user = {
    _id: openId,
    displayName: '',
    nickname: '',
    avatarUrl: '',
    familyIds: [],
    currentFamilyId: '',
    subscribeStatus: false,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  await db.collection('users').add({ data: user });
  return user;
}

async function listFamilies(openId) {
  const res = await db.collection('families').where({ memberIds: openId }).get();
  return res.data.map(normalizeFamily);
}

async function getCurrentFamily(userDoc, families, openId) {
  if (families.length === 0) {
    return null;
  }

  const currentId = userDoc.currentFamilyId;
  const current = families.find(family => family.id === currentId) || families[0];
  if (current.id !== currentId) {
    await db.collection('users').doc(openId).update({
      data: { currentFamilyId: current.id, updatedAt: nowIso() }
    });
  }

  return current;
}

async function assertFamilyMember(openId, familyId) {
  const familyRes = await db.collection('families').doc(familyId).get();
  const family = familyRes.data;

  if (!family || !(family.memberIds || []).includes(openId)) {
    throw new Error('无权访问该家庭');
  }

  return family;
}

async function getItemWithAccess(openId, itemId) {
  if (!itemId) {
    throw new Error('物品ID缺失');
  }

  const itemRes = await db.collection('items').doc(itemId).get();
  if (!itemRes.data) {
    throw new Error('物品不存在');
  }

  await assertFamilyMember(openId, itemRes.data.familyId);
  return itemRes.data;
}

async function listLocations(familyId) {
  const res = await db.collection('locations')
    .where({ familyId })
    .orderBy('count', 'desc')
    .limit(20)
    .get();

  return res.data.map(doc => ({
    id: doc._id,
    familyId: doc.familyId,
    name: doc.name || doc.location || ''
  })).filter(location => location.name);
}

async function bumpLocationHistory(familyId, locationName) {
  const name = (locationName || '').trim();
  if (!name) {
    return;
  }

  const existing = await db.collection('locations')
    .where({ familyId, name })
    .get();

  if (existing.data.length > 0) {
    await db.collection('locations').doc(existing.data[0]._id).update({
      data: { count: command.inc(1), updatedAt: nowIso() }
    });
    return;
  }

  await db.collection('locations').add({
    data: {
      familyId,
      name,
      location: name,
      count: 1,
      createdAt: nowIso(),
      updatedAt: nowIso()
    }
  });
}

function buildItemDocument({ familyId, input, createdBy, createdAt, updatedAt }) {
  const imageUrls = Array.isArray(input.imageUrls) ? input.imageUrls : [];
  const locationName = (input.locationName || '').trim() || null;
  const note = input.note || null;
  const shelfLife = input.shelfLifeValue && input.shelfLifeUnit
    ? { value: input.shelfLifeValue, unit: input.shelfLifeUnit }
    : null;

  return {
    familyId,
    name: input.name.trim(),
    imageUrl: imageUrls[0] || input.imageUrl || null,
    imageUrls,
    photoFileIds: imageUrls,
    categoryId: input.categoryId || null,
    locationId: input.locationId || null,
    locationName,
    location: locationName || '',
    expiryInputMode: input.expiryInputMode,
    expireDateSource: input.expiryInputMode === 'production_date_and_shelf_life' ? 'shelf_life' : 'direct',
    productionDate: input.productionDate || null,
    shelfLifeValue: input.shelfLifeValue || null,
    shelfLifeUnit: input.shelfLifeUnit || null,
    shelfLife,
    expiresAt: input.expiresAt,
    expireDate: input.expiresAt,
    reminderDaysBefore: Array.isArray(input.reminderDaysBefore) ? input.reminderDaysBefore : [1, 3],
    note,
    remark: note || '',
    status: computeStatus(input.expiresAt),
    createdBy,
    createdAt,
    updatedAt
  };
}

function validateItemInput(input) {
  if (!input || !input.name || !input.name.trim()) {
    throw new Error('物品名称不能为空');
  }
  if (!input.expiresAt) {
    throw new Error('过期时间不能为空');
  }
}

function normalizeUser(doc, openId) {
  const displayName = doc.displayName || doc.nickname || '';
  return {
    id: doc._id || openId,
    displayName,
    hasSetDisplayName: Boolean(displayName && displayName.trim()),
    avatarUrl: doc.avatarUrl || null,
    platformIdentities: {
      wechatOpenId: doc._id || openId,
      phone: null
    }
  };
}

function normalizeFamily(doc) {
  return {
    id: doc._id || doc.id,
    name: doc.name,
    avatarUrl: doc.avatarUrl || null,
    createdBy: doc.createdBy || doc.creatorId || '',
    createdAt: toIsoString(doc.createdAt)
  };
}

function normalizeItem(doc) {
  const imageUrls = normalizeImageUrls(doc);
  const expiresAt = doc.expiresAt || doc.expireDate;
  const locationName = doc.locationName || doc.location || null;
  const note = doc.note !== undefined ? doc.note : (doc.remark || null);
  const shelfLife = doc.shelfLife || {};

  return {
    id: doc._id || doc.id,
    familyId: doc.familyId,
    name: doc.name,
    imageUrl: doc.imageUrl || imageUrls[0] || null,
    imageUrls,
    categoryId: doc.categoryId || null,
    locationId: doc.locationId || null,
    locationName,
    expiryInputMode: doc.expiryInputMode || (doc.expireDateSource === 'shelf_life' ? 'production_date_and_shelf_life' : 'explicit_date'),
    productionDate: doc.productionDate || null,
    shelfLifeValue: doc.shelfLifeValue || shelfLife.value || null,
    shelfLifeUnit: doc.shelfLifeUnit || shelfLife.unit || null,
    expiresAt,
    reminderDaysBefore: Array.isArray(doc.reminderDaysBefore) ? doc.reminderDaysBefore : [1, 3],
    note,
    status: doc.status === 'consumed' ? 'consumed' : computeStatus(expiresAt),
    createdBy: doc.createdBy || '',
    createdAt: toIsoString(doc.createdAt),
    updatedAt: toIsoString(doc.updatedAt)
  };
}

function normalizeImageUrls(doc) {
  if (Array.isArray(doc.imageUrls)) return doc.imageUrls;
  if (Array.isArray(doc.photoFileIds)) return doc.photoFileIds;
  if (doc.imageUrl) return [doc.imageUrl];
  return [];
}

function computeStatus(expiresAt) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expire = new Date(expiresAt);
  expire.setHours(0, 0, 0, 0);

  if (Number.isNaN(expire.getTime())) return 'normal';
  if (expire < today) return 'expired';
  if (expire.getTime() === today.getTime()) return 'expires_today';

  const diffDays = Math.ceil((expire - today) / (1000 * 60 * 60 * 24));
  return diffDays <= 30 ? 'expiring' : 'normal';
}

function sortItemByStatusAndDate(a, b) {
  const statusOrder = {
    expired: 0,
    expires_today: 1,
    expiring: 2,
    normal: 3,
    consumed: 4
  };
  if (statusOrder[a.status] !== statusOrder[b.status]) {
    return statusOrder[a.status] - statusOrder[b.status];
  }
  return a.expiresAt.localeCompare(b.expiresAt);
}

function nowIso() {
  return new Date().toISOString();
}

function toIsoString(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.$date) return new Date(value.$date).toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}
