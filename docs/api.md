---
status: draft
updated: 2026-06-06
---

# API Contract Draft

## Contract Status
- 当前为 `draft`，用于指导 mock 前端和后续后端设计。
- 在家庭首页、物品列表、新增编辑、详情页面通过 mock 服务验证后，可升级为 `validated`。
- 后端实现和前端集成通过后，才可升级为 `stable`。
- MVP 后端采用微信云开发时，以下 REST-like endpoint 作为服务层语义 contract；实际实现可映射为云函数调用和云数据库集合操作。

## Resource Models

```yaml
User:
  id: string
  displayName: string
  hasSetDisplayName: boolean
  avatarUrl: string | null
  platformIdentities:
    wechatOpenId: string | null
    phone: string | null

Family:
  id: string
  name: string
  avatarUrl: string | null
  createdBy: string
  createdAt: string

FamilyMember:
  id: string
  familyId: string
  userId: string
  role: owner | member
  joinedAt: string

Item:
  id: string
  familyId: string
  name: string
  imageUrl: string | null # 兼容/封面冗余，优先使用 imageUrls[0]
  imageUrls: string[]
  categoryId: string | null
  locationId: string | null
  expiryInputMode: explicit_date | production_date_and_shelf_life
  productionDate: string | null
  shelfLifeValue: number | null
  shelfLifeUnit: day | month | year | null
  expiresAt: string
  reminderDaysBefore: number[]
  note: string | null
  status: normal | expiring | expires_today | expired | consumed
  createdBy: string
  createdAt: string
  updatedAt: string

Location:
  id: string
  familyId: string
  name: string

Category:
  id: string
  familyId: string | null
  name: string

ItemFormOptions:
  family: Family | null
  locations: Location[]

NotificationLog:
  id: string
  familyId: string
  itemId: string
  userId: string
  channel: wechat_subscription | app_push | in_app
  type: before_expiry | expires_today | expired
  sentAt: string
  status: pending | sent | failed
```

## MVP Reminder Contract
- MVP 不要求服务端真实发送微信订阅消息或 App 推送。
- 前端和 mock service 需要提供统一提醒数据结构，用于首页提醒、物品列表状态、详情页提醒信息和模拟通知。
- 后续真实推送接入时，保留 NotificationLog 和 Notification Adapter 作为扩展点。

## Expiry Input Contract
- 用户可以直接填写 `expiresAt`。
- 用户也可以填写 `productionDate`、`shelfLifeValue`、`shelfLifeUnit`，由客户端或服务层计算 `expiresAt`。
- `expiryInputMode` 记录用户选择的录入方式，便于编辑页回显。
- 无论使用哪种录入方式，`expiresAt` 都是必填的标准化结果，用于排序、状态计算和提醒。

## Example Endpoints

```yaml
GET /families:
  response:
    families: Family[]

POST /families:
  body:
    name: string
  response:
    family: Family

PATCH /me:
  body:
    displayName: string
  response:
    user: User

GET /families/{familyId}/home:
  response:
    family: Family
    locations: Location[]
    counts:
      total: number
      expiring: number
      expiresToday: number
      expired: number
    urgentItems: Item[]
    locationSummaries:
      - location: Location
        total: number
        expiring: number
        expired: number

GET /families/{familyId}/items:
  query:
    status: normal | expiring | expires_today | expired | consumed | all
    locationId: string | null
    categoryId: string | null
    search: string | null
    sort: expiresAt_asc | expiresAt_desc | updatedAt_desc
  response:
    items: Item[]

GET /items/form-options:
  response:
    family: Family | null
    locations: Location[]

POST /families/{familyId}/items:
  body:
    name: string
    imageUrl: string | null # 兼容/封面冗余，优先使用 imageUrls[0]
    imageUrls: string[]
    categoryId: string | null
    locationId: string | null
    expiryInputMode: explicit_date | production_date_and_shelf_life
    productionDate: string | null
    shelfLifeValue: number | null
    shelfLifeUnit: day | month | year | null
    expiresAt: string
    reminderDaysBefore: number[]
    note: string | null
  response:
    item: Item

PATCH /families/{familyId}/items/{itemId}:
  body: Partial<ItemInput>
  response:
    item: Item

POST /families/{familyId}/items/{itemId}/consume:
  response:
    item: Item

DELETE /families/{familyId}/items/{itemId}:
  response:
    deleted: true
```

## WeChat Cloud Development Mapping
- `GET /families` -> 云函数 `family.listMyFamilies`
- `POST /families` -> 云函数 `family.createFamily`
- `PATCH /me` -> 云函数 `user.updateProfile`
- `GET /families/{familyId}/home` -> 云函数 `home.getFamilyHome`
- `GET /items/form-options` -> 云函数 `item.getFormOptions`
- `GET /families/{familyId}/items` -> 云函数 `item.listItems`
- `POST /families/{familyId}/items` -> 云函数 `item.createItem`
- `PATCH /families/{familyId}/items/{itemId}` -> 云函数 `item.updateItem`
- `POST /families/{familyId}/items/{itemId}/consume` -> 云函数 `item.consumeItem`
- `DELETE /families/{familyId}/items/{itemId}` -> 云函数 `item.deleteItem`
- 图片上传 -> 微信云存储上传适配层，返回 `imageUrls` 或 cloud file id 列表；首页封面默认取第一张。

## Open Questions
- App 端后续是否通过云函数 HTTP 化/网关访问微信云开发资源，或在增长后迁移自建后端。
- 真实推送的通知授权、发送频率、防打扰策略作为后续任务确认。
