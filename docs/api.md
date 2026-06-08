---
status: validated
updated: 2026-06-08
---

# API Contract

## Contract Status
- 当前为 `validated`：首页、物品列表、新增/编辑表单、详情页、多图、删除、标记用完和下拉刷新已经通过 mock 前端验证。
- `validated` 表示字段和云函数语义已可用于后端实现；但尚未经过真实云函数和数据库联调。
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
  locationName: string | null # 自由输入位置；有 locationId 时可冗余保存展示名
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

FamilyHome:
  user: User
  currentFamily: Family | null
  families: Family[]
  locations: Location[]
  items: Item[] # 当前家庭下未用完物品，按 expiresAt 升序

ItemDetail:
  item: Item
  family: Family | null
  locationName: string | null

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
- 前端当前以 `Item.status` 和 `expiresAt` 驱动首页提醒、列表状态和详情状态。
- `reminderDaysBefore` 暂由表单保存默认值 `[1, 3]`，MVP 不在表单中暴露提醒配置。
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

GET /home:
  response:
    user: User
    currentFamily: Family | null
    families: Family[]
    locations: Location[]
    items: Item[]

GET /families/{familyId}/items:
  query:
    search: string | null
  response:
    items: Item[]

GET /items/{itemId}:
  response:
    item: Item
    family: Family | null
    locationName: string | null

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
    locationName: string | null
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
  body: ItemInput
  response:
    item: Item

POST /families/{familyId}/items/{itemId}/consume:
  response:
    item: Item

DELETE /families/{familyId}/items/{itemId}:
  response: void
```

## Service Layer Contract

当前前端通过 `HomeRepository` 抽象访问 mock 或云开发实现。云函数 payload 以 service contract 为准：

```yaml
home.getFamilyHome:
  payload: {}
  result: FamilyHome

user.updateProfile:
  payload: UpdateProfileInput
  result: User

family.createFamily:
  payload: CreateFamilyInput
  result: Family

item.getFormOptions:
  payload: {}
  result: ItemFormOptions

item.listItems:
  payload:
    familyId: string
    search: string
  result: Item[]

item.getItemDetail:
  payload:
    itemId: string
  result: ItemDetail

item.createItem:
  payload:
    familyId: string
    input: ItemInput
  result: Item

item.updateItem:
  payload:
    itemId: string
    input: ItemInput
  result: Item

item.consumeItem:
  payload:
    itemId: string
  result: Item

item.deleteItem:
  payload:
    itemId: string
  result: void
```

## WeChat Cloud Development Mapping
- 逻辑 contract 仍使用 `home.getFamilyHome`、`item.createItem` 等动作名。
- TASK-011 真实云开发实现采用单入口物理云函数 `yaoguoqiApi`：
  - `name`: `yaoguoqiApi`
  - `data.action`: 逻辑动作名，例如 `item.createItem`
  - `data.payload`: 对应逻辑动作 payload
- `GET /families` -> `yaoguoqiApi` action `family.listMyFamilies`
- `POST /families` -> `yaoguoqiApi` action `family.createFamily`
- `PATCH /me` -> `yaoguoqiApi` action `user.updateProfile`
- `GET /home` -> `yaoguoqiApi` action `home.getFamilyHome`
- `GET /items/form-options` -> `yaoguoqiApi` action `item.getFormOptions`
- `GET /families/{familyId}/items` -> `yaoguoqiApi` action `item.listItems`
- `GET /items/{itemId}` -> `yaoguoqiApi` action `item.getItemDetail`
- `POST /families/{familyId}/items` -> `yaoguoqiApi` action `item.createItem`
- `PATCH /families/{familyId}/items/{itemId}` -> `yaoguoqiApi` action `item.updateItem`
- `POST /families/{familyId}/items/{itemId}/consume` -> `yaoguoqiApi` action `item.consumeItem`
- `DELETE /families/{familyId}/items/{itemId}` -> `yaoguoqiApi` action `item.deleteItem`
- 图片上传 -> 微信云存储上传适配层，返回 `imageUrls` 或 cloud file id 列表；首页封面默认取第一张。

## Open Questions
- App 端后续是否通过云函数 HTTP 化/网关访问微信云开发资源，或在增长后迁移自建后端。
- 真实推送的通知授权、发送频率、防打扰策略作为后续任务确认。

## Backend Implementation Notes
- 后端应在写入或读取时保证 `status` 与 `expiresAt` 一致；前端 mock 当前在 service 层计算状态。
- 首页大数据量优化已经进入 Backlog；后续真实接口可扩展游标分页、状态筛选和分组摘要，但当前 validated contract 不要求分页。
- 图片当前以 `imageUrls` 字符串数组表达，真实接入微信云存储后建议保存 cloud file id 或可访问 URL，并继续保持首页封面取 `imageUrls[0]`。
- `locationName` 支持自由输入位置；当 `locationId` 为 null 时仍可保存和展示用户输入的位置文本。
