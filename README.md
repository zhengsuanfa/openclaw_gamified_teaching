# OpenClaw Gamified Teaching

一个基于 Next.js 的游戏化教程平台，通过关卡闯关的方式引导用户完成 [OpenClaw](https://openclaw.ai) 的安装与配置。

## 功能特性

- 🎮 **游戏化学习** — XP 积分、等级晋升、成就徽章，让安装教程变成闯关游戏
- 🤖 **5 个教程章节** — 涵盖环境准备、安装、聊天平台接入、Gateway 配置、Skills 集成
- 🌐 **多平台分支** — 支持 WhatsApp / Telegram / Discord / 飞书四条平台路径
- 🏆 **成就系统** — 升级时弹出专属头像动画，实时 XP 进度条
- 📱 **响应式布局** — 移动端抽屉菜单，桌面三栏布局

## 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 16](https://nextjs.org) | App Router，静态导出 |
| [Tailwind CSS v4](https://tailwindcss.com) | 原子化样式 |
| [Framer Motion](https://www.framer.com/motion/) | 动画效果 |
| [shadcn/ui](https://ui.shadcn.com) | 基础 UI 组件 |
| [Lucide React](https://lucide.dev) | 图标库 |

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 教程章节

| 章节 | 内容 |
|------|------|
| 第 1 章 | 环境准备 — 安装 Node.js、pnpm |
| 第 2 章 | 安装 OpenClaw — npx/全局安装 |
| 第 3 章 | 聊天平台接入 — WhatsApp/Telegram/Discord/飞书 |
| 第 4 章 | Gateway 配置 — 连接 Claude/GPT |
| 第 5 章 | Skills 集成 — 安装 clawhub |

## 联系

如需 1 对 1 技术指导，微信：**zhengsuanfa**
