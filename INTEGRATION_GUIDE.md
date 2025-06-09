# Angel 心灵驿站 - 前端API接入指南

## 🚀 接入完成情况

### ✅ 已完成的接入

1. **心愿墙功能**
   - ✅ 创建心愿 (`POST /api/wishes/create`)
   - ✅ 获取心愿列表 (`GET /api/wishes/list`)
   - ✅ 点赞心愿 (`POST /api/wishes/like`)

2. **内心留言功能**
   - ✅ 发布留言 (`POST /api/messages/create`)
   - ✅ 获取留言列表 (`GET /api/messages/list`)
   - ✅ 送拥抱 (`POST /api/messages/hug`)

3. **AI聊天功能**
   - ✅ 创建会话 (`POST /api/chat/sessions`)
   - ✅ 发送消息 (`POST /api/chat/send`)

### 📁 新增文件结构

```
lib/
├── api.ts          # API调用工具库
├── config.ts       # 配置文件
└── utils.ts        # 原有工具函数

hooks/
├── useApi.ts       # API相关React hooks
├── use-toast.ts    # 原有toast hooks
└── use-mobile.tsx  # 原有移动端hooks
```

## 🔧 使用方法

### 1. 启动后端服务

确保您的后端服务运行在 `http://localhost:3001`

```bash
# 在后端项目目录中
npm start
# 或
node server.js
```

### 2. 配置环境变量（可选）

如果需要修改API地址，可以创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 3. 启动前端服务

```bash
npm run dev
```

## 📋 API接入详情

### 心愿墙 (Wishes)

**数据流程：**
1. 页面加载时自动获取心愿列表
2. 用户提交新心愿时调用创建API
3. 用户点赞时调用点赞API并更新本地状态

**关键函数：**
- `handleWishSubmit()` - 创建心愿
- `likeWish()` - 点赞心愿
- `loadInitialData()` - 初始化加载

### 内心留言 (Messages)

**数据流程：**
1. 页面加载时自动获取留言列表
2. 用户发布留言时调用创建API
3. 用户送拥抱时调用拥抱API

**关键函数：**
- `handleInnerMessageSubmit()` - 发布留言
- `handleSendHug()` - 送拥抱

### AI聊天 (Chat)

**数据流程：**
1. 页面加载时创建聊天会话
2. 用户发送消息时调用发送API
3. 显示AI回复，失败时使用备用回复

**关键函数：**
- `handleSendMessage()` - 发送消息
- 会话ID存储在 `currentSessionId` 状态中

## 🔄 错误处理

### API调用失败处理

1. **网络错误**：显示友好的错误提示
2. **服务器错误**：使用备用数据或功能
3. **超时处理**：自动重试机制

### 备用方案

- **聊天功能**：API失败时使用预设回复
- **数据加载**：失败时显示空状态或默认数据
- **操作反馈**：通过loading状态提供用户反馈

## 🎯 待完成功能

### 高优先级
- [ ] 回复留言功能 (`POST /api/messages/reply`)
- [ ] 聊天历史记录加载
- [ ] 游戏分数提交和排行榜

### 中优先级
- [ ] 分页加载更多数据
- [ ] 实时数据更新
- [ ] 离线状态处理

### 低优先级
- [ ] 数据缓存优化
- [ ] 性能监控
- [ ] 错误日志收集

## 🛠️ 开发指南

### 添加新的API接口

1. **在 `lib/api` 模块中添加新的API函数**
```typescript
export const newApi = {
  someAction: async (param: string): Promise<ApiResponse<SomeType>> => {
    return apiRequest<SomeType>('/api/new/endpoint', {
      method: 'POST',
      body: JSON.stringify({ param }),
    });
  },
};
```

2. **在组件中使用**
```typescript
const newAction = useApiAction<{ param: string }, SomeType>();

const handleAction = async () => {
  const result = await newAction.execute(
    (params) => newApi.someAction(params.param),
    { param: "value" }
  );
  
  if (result) {
    // 处理成功结果
  }
};
```

### 类型定义

所有API相关的类型都定义在 `lib/api` 模块中：
- `Wish` - 心愿数据类型
- `InnerMessage` - 内心留言数据类型
- `ChatMessage` - 聊天消息数据类型
- `Reply` - 回复数据类型

## 🔍 调试指南

### 检查API连接

1. 打开浏览器开发者工具
2. 查看Network标签页
3. 确认API请求是否正常发送和接收

### 常见问题

1. **CORS错误**：确保后端配置了正确的CORS设置
2. **404错误**：检查API路径是否正确
3. **500错误**：查看后端日志确认服务器状态

### 日志查看

前端控制台会显示：
- API请求失败的详细信息
- 数据加载状态
- 错误堆栈信息

## 📞 技术支持

如遇到问题，请检查：
1. 后端服务是否正常运行
2. API文档是否与实际接口一致
3. 网络连接是否正常
4. 浏览器控制台是否有错误信息

---

**最后更新**: 2024-03-19
**版本**: v1.0.0