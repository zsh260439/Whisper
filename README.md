# Whisper · 轻语

一款基于 Vue + TypeScript + Node.js + Express + WebSocket + MongoDB + Tauri 的即时通讯应用，采用北欧极简（Scandi）设计风格。

## 技术栈

| 分类 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| UI 组件库 | Element Plus |
| 原子化 CSS | UnoCSS |
| 后端框架 | Node.js + Express |
| 实时通信 | WebSocket |
| 数据库 | MongoDB |
| 桌面端 | Tauri |
| 构建工具 | Vite |

## 已完成功能

### 📌 消息通信
- ✅ 账号密码登录（支持注册）
- ✅ 一对一私聊
- ✅ 群组聊天
- ✅ 消息撤回（2分钟内）
- ✅ @提醒功能
- ✅ 回复消息，消息引用
- ✅ 消息已读状态
- ✅ 表情包
- ✅ 消息右键菜单
- ✅ 链接预览卡片
- ✅ 消息点赞/倒赞
- ✅ 历史记录（MongoDB）
- ✅ 消息搜索

### 📌 用户系统
- ✅ 好友添加/删除
- ✅ 好友搜索
- ✅ 好友申请通知
- ✅ 用户资料卡
- ✅ 备注昵称

### 📌 群组功能
- ✅ 群组创建/解散
- ✅ 群组成员管理
- ✅ 群公告
- ✅ 消息转发

### 📌 社交功能
- ✅ 好友在线状态
- ✅ 屏蔽/拉黑
- ✅ 免打扰模式
- ✅ 好友申请通知

### 📌 桌面端功能
- ✅ 多窗口管理
- ✅ 系统托盘
- ✅ 全局快捷键
- ✅ 桌面通知
- ✅ 截图功能
- ✅ 文件操作
- ✅ 自动更新
- ✅ 深色/浅色主题

### 📌 图片相关
- ✅ 图片查看器
- ✅ 截图发送

## 待开发功能

### 🔲 AI 功能
- ⬜ AI 对话

### 🔲 通话功能
- ⬜ 音视频通话

### 🔲 社交功能
- ⬜ 朋友圈/动态（发布动态、点赞、评论）

## 设计风格

采用北欧（Scandi）极简风格设计理念：
- 大量白色和浅灰为基底
- 柔和的绿色作为主色调
- 小圆角、轻阴影
- 整洁、对齐、节奏感强的布局
- 动画短而干净，轻微背景提亮

## 项目结构

```
src/
├── assets/
│   └── styles/
│       └── global.css        # 全局样式
├── components/
│   ├── ChatSidebar.vue      # 聊天侧边栏
│   ├── ChatWindow.vue       # 聊天窗口
│   └── MouseFollowLine.vue   # 鼠标跟随线
├── composables/
│   └── useMousePosition.ts   # 鼠标位置组合式函数
├── router/
│   └── index.ts             # 路由配置
├── views/
│   ├── ChatPage.vue         # 聊天页面
│   └── LoginPage.vue        # 登录页面
├── App.vue                  # 根组件
└── main.ts                  # 入口文件
```

## 开发指南

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## License

MIT
