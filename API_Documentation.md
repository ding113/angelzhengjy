# Angel 心灵驿站 API 文档

## 📖 概述

Angel 心灵驿站是一个提供心理健康支持的后端API服务，包含心愿墙、AI聊天、内心留言和小游戏四大核心功能模块。

- **服务地址**: `http://localhost:3001`
- **API版本**: v1.0.0
- **数据库**: MongoDB
- **认证方式**: 无需认证（开放API）

## 🚀 快速开始

### 统一响应格式

所有API接口都使用统一的响应格式：

**成功响应**:
```json
{
  "success": true,
  "data": { /* 具体数据 */ },
  "message": "操作成功消息（可选）"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "错误消息",
  "details": "详细错误信息（可选）"
}
```

### 通用查询参数

- `page`: 页码（默认值: 1）
- `limit`: 每页数量（默认值: 10，最大值: 100）

---

## 💫 心愿墙 API (`/api/wishes`)

### 1. 创建心愿

**接口**: `POST /api/wishes/create`

**请求体**:
```json
{
  "text": "希望世界和平",
  "author": "张三"
}
```

**字段说明**:
- `text` (string, 必填): 心愿内容，最大500字
- `author` (string, 必填): 许愿人姓名，最大100字

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65f8b4c3d4e5f6a7b8c9d0e1",
    "text": "希望世界和平",
    "author": "张三",
    "likes": 0,
    "createdAt": "2024-03-19T08:30:00.000Z",
    "updatedAt": "2024-03-19T08:30:00.000Z"
  },
  "message": "心愿创建成功"
}
```

### 2. 获取心愿列表

**接口**: `GET /api/wishes/list`

**查询参数**:
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 10，最大: 100）
- `sortBy` (string): 排序方式
  - `latest`: 最新创建（默认）
  - `popular`: 按点赞数排序

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "65f8b4c3d4e5f6a7b8c9d0e1",
        "text": "希望世界和平",
        "author": "张三",
        "likes": 5,
        "createdAt": "2024-03-19T08:30:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 3. 获取心愿统计

**接口**: `GET /api/wishes/stats`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 150
  }
}
```

### 4. 获取心愿详情

**接口**: `GET /api/wishes/detail`

**查询参数**:
- `id` (string, 必填): 心愿ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65f8b4c3d4e5f6a7b8c9d0e1",
    "text": "希望世界和平",
    "author": "张三",
    "likes": 5,
    "createdAt": "2024-03-19T08:30:00.000Z",
    "updatedAt": "2024-03-19T08:30:00.000Z"
  }
}
```

### 5. 点赞心愿

**接口**: `POST /api/wishes/like`

**查询参数**:
- `id` (string, 必填): 心愿ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "likes": 6
  }
}
```

---

## 🤖 AI聊天 API (`/api/chat`)

### 1. 创建会话

**接口**: `POST /api/chat/sessions`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "sessionId": "session_1710836400000_abc123def"
  },
  "message": "会话创建成功"
}
```

### 2. 发送消息

**接口**: `POST /api/chat/send`

**请求体**:
```json
{
  "message": "你好，我感觉有点焦虑",
  "sessionId": "session_1710836400000_abc123def"
}
```

**字段说明**:
- `message` (string, 必填): 用户消息，最大1000字
- `sessionId` (string, 必填): 会话ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userMessage": {
      "messageId": "session_1710836400000_abc123def_1710836401000_xyz789",
      "sessionId": "session_1710836400000_abc123def",
      "difyConversationId": "dify_conv_123456",
      "text": "你好，我感觉有点焦虑",
      "isAI": false,
      "createdAt": "2024-03-19T08:30:01.000Z"
    },
    "aiMessage": {
      "messageId": "session_1710836400000_abc123def_1710836402000_abc456",
      "sessionId": "session_1710836400000_abc123def",
      "difyConversationId": "dify_conv_123456",
      "text": "我理解你的感受。焦虑是很常见的情绪，让我们一起来聊聊...",
      "isAI": true,
      "createdAt": "2024-03-19T08:30:02.000Z"
    }
  }
}
```

### 3. 获取对话历史

**接口**: `GET /api/chat/history`

**查询参数**:
- `sessionId` (string, 必填): 会话ID
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 50，最大: 100）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "messageId": "session_1710836400000_abc123def_1710836401000_xyz789",
        "sessionId": "session_1710836400000_abc123def",
        "text": "你好，我感觉有点焦虑",
        "isAI": false,
        "createdAt": "2024-03-19T08:30:01.000Z"
      }
    ],
    "total": 20
  }
}
```

### 4. 获取单条消息详情

**接口**: `GET /api/chat/message/detail`

**查询参数**:
- `messageId` (string, 必填): 消息ID

### 5. 获取会话列表

**接口**: `GET /api/chat/sessions/list`

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "session_1710836400000_abc123def",
      "lastMessage": "谢谢你的建议，我感觉好多了",
      "lastMessageTime": "2024-03-19T09:15:30.000Z",
      "lastMessageId": "session_1710836400000_abc123def_1710839730000_xyz123",
      "messageCount": 15
    }
  ]
}
```

### 6. 删除会话

**接口**: `DELETE /api/chat/session/delete`

**查询参数**:
- `sessionId` (string, 必填): 会话ID

### 7. 删除单条消息

**接口**: `DELETE /api/chat/message/delete`

**查询参数**:
- `messageId` (string, 必填): 消息ID

---

## 💌 内心留言 API (`/api/messages`)

### 1. 发布留言

**接口**: `POST /api/messages/create`

**请求体**:
```json
{
  "text": "今天心情不太好，希望能得到一些安慰",
  "author": "小明",
  "color": "from-pink-200 to-pink-100"
}
```

**字段说明**:
- `text` (string, 必填): 留言内容，最大200字
- `author` (string, 必填): 留言者姓名，最大100字
- `color` (string, 必填): 便签颜色，可选值：
  - `from-pink-200 to-pink-100`
  - `from-blue-200 to-blue-100`
  - `from-green-200 to-green-100`
  - `from-yellow-200 to-yellow-100`
  - `from-purple-200 to-purple-100`
  - `from-orange-200 to-orange-100`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65f8b4c3d4e5f6a7b8c9d0e2",
    "text": "今天心情不太好，希望能得到一些安慰",
    "author": "小明",
    "color": "from-pink-200 to-pink-100",
    "hugs": 0,
    "replies": [],
    "createdAt": "2024-03-19T08:30:00.000Z",
    "updatedAt": "2024-03-19T08:30:00.000Z"
  },
  "message": "留言发布成功"
}
```

### 2. 获取留言列表

**接口**: `GET /api/messages/list`

**查询参数**:
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 20，最大: 100）

### 3. 获取热门留言

**接口**: `GET /api/messages/popular`

**查询参数**:
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 10，最大: 100）

### 4. 获取留言统计

**接口**: `GET /api/messages/stats`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalMessages": 89,
    "totalHugs": 234,
    "totalReplies": 156
  }
}
```

### 5. 获取留言详情

**接口**: `GET /api/messages/detail`

**查询参数**:
- `id` (string, 必填): 留言ID

### 6. 送拥抱

**接口**: `POST /api/messages/hug`

**查询参数**:
- `id` (string, 必填): 留言ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "hugs": 5
  }
}
```

### 7. 回复留言

**接口**: `POST /api/messages/reply`

**查询参数**:
- `id` (string, 必填): 留言ID

**请求体**:
```json
{
  "text": "加油！一切都会好起来的！",
  "author": "小红"
}
```

**字段说明**:
- `text` (string, 必填): 回复内容，最大200字
- `author` (string, 必填): 回复者姓名，最大100字

**响应示例**:
```json
{
  "success": true,
  "data": {
    "replyId": "reply_65f8b4c3d4e5f6a7b8c9d0e2_1710836403000_abc123",
    "text": "加油！一切都会好起来的！",
    "author": "小红",
    "createdAt": "2024-03-19T08:30:03.000Z"
  },
  "message": "回复成功"
}
```

### 8. 获取回复详情

**接口**: `GET /api/messages/reply/detail`

**查询参数**:
- `replyId` (string, 必填): 回复ID

### 9. 删除回复

**接口**: `DELETE /api/messages/reply/delete`

**查询参数**:
- `replyId` (string, 必填): 回复ID

---

## 🎮 游戏 API (`/api/games`)

### 滑雪游戏 (`/skiing`)

#### 1. 提交分数

**接口**: `POST /api/games/skiing/scores`

**请求体**:
```json
{
  "playerName": "玩家小王",
  "score": 8500,
  "duration": 120
}
```

**字段说明**:
- `playerName` (string, 必填): 玩家姓名，最大100字
- `score` (number, 必填): 游戏分数，≥0
- `duration` (number, 必填): 游戏时长（秒），≥0

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65f8b4c3d4e5f6a7b8c9d0e3",
    "playerName": "玩家小王",
    "score": 8500,
    "duration": 120,
    "rank": 3,
    "createdAt": "2024-03-19T08:30:00.000Z"
  },
  "message": "滑雪分数提交成功"
}
```

#### 2. 获取排行榜

**接口**: `GET /api/games/skiing/leaderboard`

**查询参数**:
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 10，最大: 100）

**响应示例**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "_id": "65f8b4c3d4e5f6a7b8c9d0e3",
        "playerName": "玩家小王",
        "score": 12000,
        "duration": 150,
        "rank": 1,
        "createdAt": "2024-03-19T08:30:00.000Z"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 3. 获取游戏统计

**接口**: `GET /api/games/skiing/stats`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalPlayers": 23,
    "totalGames": 156,
    "highestScore": 15000,
    "topPlayer": "滑雪高手",
    "avgScore": 7500,
    "avgDuration": 95
  }
}
```

#### 4. 获取玩家记录

**接口**: `GET /api/games/skiing/player/records`

**查询参数**:
- `playerName` (string, 必填): 玩家姓名
- `page` (number): 页码（默认: 1）
- `limit` (number): 每页数量（默认: 10，最大: 100）

### 数羊游戏 (`/sheep`)

数羊游戏的接口与滑雪游戏完全相同，只需将URL中的 `/skiing/` 替换为 `/sheep/` 即可。

#### 接口列表：
- `POST /api/games/sheep/scores` - 提交数羊分数
- `GET /api/games/sheep/leaderboard` - 获取数羊排行榜
- `GET /api/games/sheep/stats` - 获取数羊统计
- `GET /api/games/sheep/player/records` - 获取玩家数羊记录

### 综合游戏统计

**接口**: `GET /api/games/stats`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "skiing": {
      "totalPlayers": 23,
      "totalGames": 156,
      "highestScore": 15000,
      "topPlayer": "滑雪高手"
    },
    "sheep": {
      "totalPlayers": 31,
      "totalGames": 203,
      "highestScore": 500,
      "topPlayer": "数羊达人"
    },
    "overall": {
      "totalPlayers": 54,
      "totalGames": 359
    }
  }
}
```

---

## 🔧 系统接口

### 健康检查

**接口**: `GET /health`

**响应示例**:
```json
{
  "success": true,
  "message": "Angel 心灵驿站后端服务运行正常",
  "timestamp": "2024-03-19T08:30:00.000Z",
  "uptime": 3600.5
}
```

### API信息

**接口**: `GET /api`

返回所有可用接口的详细信息。

---

## 📝 数据模型

### 心愿 (Wish)
```javascript
{
  _id: ObjectId,
  text: String,      // 心愿内容，最大500字
  author: String,    // 许愿人，最大100字
  likes: Number,     // 点赞数，默认0
  createdAt: Date,   // 创建时间
  updatedAt: Date    // 更新时间
}
```

### 聊天消息 (ChatMessage)
```javascript
{
  _id: ObjectId,
  messageId: String,          // 唯一消息ID
  sessionId: String,          // 会话ID
  difyConversationId: String, // Dify AI对话ID（可选）
  text: String,               // 消息内容，最大1000字
  isAI: Boolean,              // 是否为AI消息
  createdAt: Date             // 创建时间
}
```

### 内心留言 (InnerMessage)
```javascript
{
  _id: ObjectId,
  text: String,     // 留言内容，最大200字
  author: String,   // 留言者，最大100字
  color: String,    // 便签颜色
  hugs: Number,     // 拥抱数，默认0
  replies: [{       // 回复列表
    replyId: String,  // 回复ID
    text: String,     // 回复内容，最大200字
    author: String,   // 回复者，最大100字
    createdAt: Date   // 回复时间
  }],
  createdAt: Date,  // 创建时间
  updatedAt: Date   // 更新时间
}
```

### 游戏分数 (SkiingScore/SheepScore)
```javascript
{
  _id: ObjectId,
  playerName: String, // 玩家姓名，最大100字
  score: Number,      // 分数，≥0
  duration: Number,   // 游戏时长（秒），≥0
  createdAt: Date     // 创建时间
}
```

---

## ⚠️ 错误码说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 📞 联系与支持

如有问题或建议，请联系开发团队。

---

**文档版本**: v1.0.0  
**最后更新**: 2024-03-19 