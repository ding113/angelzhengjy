# Dreamy web design

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/infamousgxys-projects/v0-dreamy-web-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/UDQc2vTQKT6)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/infamousgxys-projects/v0-dreamy-web-design](https://vercel.com/infamousgxys-projects/v0-dreamy-web-design)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/UDQc2vTQKT6](https://v0.dev/chat/projects/UDQc2vTQKT6)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## 项目结构

```text
app/                  Next.js 页面与路由
  ├─ page.tsx        首页
  ├─ sheep/        捉羊小游戏
  └─ skiing/       滑雪小游戏
components/           可复用组件
  ├─ FloatingPetals.tsx
  ├─ WelcomeModal.tsx
  ├─ icons.tsx      SVG 图标集合
  └─ ui/            shadcn/ui 基础组件
hooks/                React hooks
  └─ useApi.ts
lib/                  全局库和 API 方法
  ├─ api/
  │   ├─ chat.ts
  │   ├─ client.ts
  │   ├─ games.ts
  │   ├─ messages.ts
  │   ├─ wishes.ts
  │   ├─ types.ts
  │   └─ index.ts  统一导出
  ├─ skiing/
  │   └─ constants.ts
  ├─ config.ts
  └─ utils.ts
public/               静态资源
styles/               全局 CSS 文件
```

## 代码流程概述

- **lib/api** 目录展示了各功能模块的接口，例如 `wishesApi` 和 `chatApi`。通过 `lib/api/index.ts` 可以一次性导入所有 API 函数。
- **components** 供接得使用的 React 组件，包含动画背景、图标以及 shadcn/ui 基础组件。
- **app** 中包含首页和小游戏页面，每一页都使用了自定义 API 或平台组件。
- **hooks** 提供自定义的 React Hook，用于处理 API 线程和其他常用逻辑。

