export type StepStatus = 'done' | 'active' | 'locked'

export interface CodeBlock {
  language: string
  code: string
  description?: string
}

export interface TutorialStep {
  id: string
  title: string
  subtitle: string
  description: string
  xp: number
  codeBlocks?: CodeBlock[]
  tips?: string[]
  platform?: 'mac' | 'windows' | 'linux' | 'all'
  type?: 'choice' | 'normal' | 'link-cta'
  choices?: Array<{ id: string; label: string; icon: string; targetStepId: string }>
  platformGroup?: string
}

export interface TutorialChapter {
  id: string
  title: string
  chapterXp: number
  steps: TutorialStep[]
}

export const CHAPTERS: TutorialChapter[] = [
  {
    id: 'chapter-1',
    title: '环境准备',
    chapterXp: 150,
    steps: [
      {
        id: 'step-1-1',
        title: '检查 Node.js 版本',
        subtitle: '确保 Node.js >= 22',
        description: 'OpenClaw 需要 Node.js 22 或以上版本。在终端中运行以下命令检查当前版本。如果版本低于 22，请先升级。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'node -v',
            description: '检查 Node.js 版本（需要 v22+）',
          },
        ],
        tips: [
          '如果版本低于 22，推荐使用 nvm 管理 Node 版本：https://github.com/nvm-sh/nvm',
          'macOS 也可用 Homebrew：brew install node',
          'Windows 直接从 nodejs.org 下载最新 LTS 版本',
        ],
      },
      {
        id: 'step-1-2',
        title: '准备 AI 模型 API 密钥',
        subtitle: '获取 Claude 或 OpenAI 的 API Key',
        description: 'OpenClaw 支持 Anthropic Claude、OpenAI 等多种模型，也支持本地模型。官方推荐使用 Claude——效果最好，进入 claude.ai/settings 获取 API Key。',
        xp: 50,
        tips: [
          'Anthropic API Key：https://console.anthropic.com/',
          'OpenAI API Key：https://platform.openai.com/api-keys',
          '也支持 MiniMax、本地 Ollama 等，无需外网即可使用',
          '建议申请后先保存到安全位置，安装时会用到',
        ],
      },
      {
        id: 'step-1-3',
        title: '了解 OpenClaw 是什么',
        subtitle: '开始前先了解它的架构',
        description: 'OpenClaw 是一个自托管的 AI 助手网关（Gateway），运行在你自己的机器或服务器上。它将 WhatsApp、Telegram、飞书等聊天应用与 Claude/GPT 等 AI 模型连接起来，让你随时随地通过手机操控 AI 完成任务。',
        xp: 50,
        tips: [
          '完全开源 MIT 协议，数据留在你自己的机器上',
          '一个 Gateway 同时服务多个聊天应用频道',
          '支持持久记忆、Skills 插件、多 Agent 协作',
          '官网：https://openclaw.ai | 文档：https://docs.openclaw.ai',
        ],
      },
    ],
  },
  {
    id: 'chapter-2',
    title: '安装 OpenClaw',
    chapterXp: 200,
    steps: [
      {
        id: 'step-2-1',
        title: '一键安装',
        subtitle: '最简单的安装方式',
        description: '运行官方一键安装脚本，它会自动帮你安装 Node.js 和所有依赖，适合 macOS、Windows 和 Linux。也可以用 npm 全局安装。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'curl -fsSL https://openclaw.ai/install.sh | bash',
            description: '官方一键安装脚本（macOS / Linux）',
          },
          {
            language: 'bash',
            code: 'npm install -g openclaw@latest',
            description: '或使用 npm 全局安装',
          },
        ],
        tips: [
          'Windows 用户推荐使用 npm 方式安装',
          '安装完成后新开一个终端窗口让 PATH 生效',
        ],
      },
      {
        id: 'step-2-2',
        title: '运行引导式配置',
        subtitle: 'onboard 命令完成所有初始设置',
        description: '运行 onboard 命令，它会引导你填写 API Key、配置模型，并可选择将 OpenClaw 注册为系统服务（daemon），开机自启。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'openclaw onboard --install-daemon',
            description: '引导式配置并注册为系统服务',
          },
        ],
        tips: [
          '配置文件保存在 ~/.openclaw/openclaw.json',
          '--install-daemon 让 OpenClaw 开机自动运行，推荐开启',
          '没有 daemon 也可以，后续手动 openclaw gateway run 启动',
        ],
      },
      {
        id: 'step-2-3',
        title: '验证安装成功',
        subtitle: '检查版本和配置状态',
        description: '安装完成后，运行以下命令确认 OpenClaw 已正确安装，并查看当前版本号。',
        xp: 100,
        codeBlocks: [
          {
            language: 'bash',
            code: 'openclaw -v',
            description: '查看 OpenClaw 版本号',
          },
          {
            language: 'bash',
            code: 'openclaw gateway run',
            description: '手动启动 Gateway（未注册 daemon 时使用）',
          },
        ],
        tips: [
          '看到版本号输出即说明安装成功',
          'Gateway 启动后默认监听 http://127.0.0.1:18789/',
          '升级命令：npm install -g openclaw@latest',
        ],
      },
    ],
  },
  {
    id: 'chapter-3',
    title: '连接聊天应用',
    chapterXp: 250,
    steps: [
      {
        id: 'step-3-0',
        type: 'choice',
        title: '选择你的聊天平台',
        subtitle: '先选一个你最常用的平台开始接入',
        description: 'OpenClaw 支持 WhatsApp、Telegram、Discord 和飞书等主流聊天平台。选择其中一个开始，后续随时可以接入更多平台。',
        xp: 0,
        choices: [
          { id: 'whatsapp', label: 'WhatsApp', icon: '💬', targetStepId: 'step-3-1' },
          { id: 'telegram', label: 'Telegram', icon: '✈️', targetStepId: 'step-3-2' },
          { id: 'discord', label: 'Discord', icon: '🎮', targetStepId: 'step-3-3' },
          { id: 'feishu', label: '飞书 Feishu', icon: '🪁', targetStepId: 'step-3-4' },
        ],
      },
      {
        id: 'step-3-1',
        platformGroup: 'whatsapp',
        title: '连接 WhatsApp',
        subtitle: '扫码配对，随时随地控制 Agent',
        description: '运行 channels login 命令，扫描二维码完成 WhatsApp 配对。配对成功后，你就可以在 WhatsApp 里直接和 OpenClaw 对话。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'openclaw channels login',
            description: '扫码配对 WhatsApp',
          },
          {
            language: 'bash',
            code: 'openclaw gateway --port 18789',
            description: '启动 Gateway 并开始监听',
          },
        ],
        tips: [
          '扫码后等待"已连接"提示，配对成功',
          '支持在 WhatsApp 私信和群聊中使用',
          '群聊中需 @机器人 才触发回复（可配置）',
        ],
      },
      {
        id: 'step-3-2',
        platformGroup: 'telegram',
        title: '连接 Telegram',
        subtitle: '创建 Bot 并完成绑定',
        description: '在 Telegram 中向 @BotFather 发送 /newbot 命令创建机器人，获取 Bot Token，然后在 OpenClaw 配置中填入 token。',
        xp: 50,
        codeBlocks: [
          {
            language: 'json',
            code: '{\n  "channels": {\n    "telegram": {\n      "botToken": "你的_BOT_TOKEN"\n    }\n  }\n}',
            description: '在 ~/.openclaw/openclaw.json 中添加配置',
          },
          {
            language: 'bash',
            code: 'openclaw config set channels.telegram.botToken 你的_BOT_TOKEN',
            description: '或用命令行直接设置',
          },
        ],
        tips: [
          '向 @BotFather 发送 /newbot 开始创建，按提示输入名称',
          'BotFather 会返回一串 token，格式如：123456:ABC-DEF...',
          '配置后重启 Gateway 生效',
        ],
      },
      {
        id: 'step-3-3',
        platformGroup: 'discord',
        title: '连接 Discord',
        subtitle: '机器人上线，服务器里的 AI 助手',
        description: 'OpenClaw 支持 Discord，配置 Bot Token 即可接入服务器。在 Discord 开发者平台创建应用，授权 Bot 权限后将 Token 填入配置文件。',
        xp: 100,
        codeBlocks: [
          {
            language: 'json',
            code: '{\n  "channels": {\n    "discord": {\n      "token": "你的_DISCORD_BOT_TOKEN",\n      "guildId": "你的_服务器ID"\n    }\n  }\n}',
            description: 'Discord Bot 配置（~/.openclaw/openclaw.json）',
          },
        ],
        tips: [
          'Discord Bot Token 在 discord.com/developers/applications 创建',
          '在"Bot"选项卡中启用"Message Content Intent"权限',
          '可同时配置多个频道，一个 Gateway 全部服务',
          '查看所有支持的集成：https://openclaw.ai/integrations',
        ],
      },
      {
        id: 'step-3-4',
        platformGroup: 'feishu',
        title: '创建飞书企业自建应用',
        subtitle: '在飞书开放平台注册机器人',
        description: '登录飞书开放平台（open.feishu.cn），创建一个企业自建应用，添加"机器人"能力，然后批量导入 OpenClaw 所需的全部权限。',
        xp: 50,
        codeBlocks: [
          {
            language: 'json',
            description: '在"权限管理 > 批量导入"页签中粘贴以下权限配置',
            code: `{
  "scopes": {
    "tenant": [
      "contact:contact.base:readonly",
      "docx:document:readonly",
      "im:chat:read",
      "im:chat:update",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:recall",
      "im:message:send_as_bot",
      "im:message:send_multi_users"
    ],
    "user": [
      "calendar:calendar",
      "calendar:calendar:readonly",
      "docx:document",
      "task:task:write"
    ]
  }
}`,
          },
        ],
        tips: [
          '开放平台地址：https://open.feishu.cn/app',
          '创建应用 → 添加应用能力 → 选"机器人"',
          '在"开发配置 > 权限管理"中点"批量导入/导出权限"',
          '在"基础信息 > 凭证与基础信息"中记录 App ID 和 App Secret',
          '记得点击"创建版本"并提交审核发布，权限才能生效',
        ],
      },
      {
        id: 'step-3-5',
        platformGroup: 'feishu',
        title: '安装飞书官方插件',
        subtitle: '一键安装 OpenClaw 飞书官方插件',
        description: '确保 OpenClaw 已是最新版（macOS/Linux ≥ 2026.2.26，Windows ≥ 2026.3.2），然后运行以下命令安装官方插件，按提示填入 App ID 和 App Secret。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            description: '检查 OpenClaw 版本（如低于要求先升级）',
            code: 'openclaw -v\n# 如需升级：\nnpm install -g openclaw@latest',
          },
          {
            language: 'bash',
            description: '安装飞书官方插件（如报错请在前面加 sudo）',
            code: 'npx -y https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz install',
          },
          {
            language: 'bash',
            description: '验证插件状态（feishu-openclaw-plugin 应显示 loaded）',
            code: 'openclaw plugins list',
          },
        ],
        tips: [
          '安装过程中会提示填入 App ID 和 App Secret，按提示粘贴即可',
          '如已有旧版飞书插件，安装时会自动禁用旧插件',
          '如遇网络问题，可先执行：export NPM_CONFIG_REGISTRY=https://registry.npmmirror.com',
        ],
      },
      {
        id: 'step-3-6',
        platformGroup: 'feishu',
        title: '订阅事件与配置回调',
        subtitle: '让机器人能接收消息和卡片点击',
        description: '在飞书开放平台为应用配置事件订阅（选"长链接"模式），添加"接收消息"等 3 个事件；再配置消息卡片回调（也选长链接），最后启动 Gateway。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            description: '启动 OpenClaw Gateway',
            code: 'openclaw gateway run',
          },
          {
            language: 'bash',
            description: '开启流式输出（推荐，消息逐字输出更顺滑）',
            code: 'openclaw config set channels.feishu.streaming true',
          },
          {
            language: 'bash',
            description: '开启话题独立上下文（群聊多任务并行）',
            code: 'openclaw config set channels.feishu.threadSession true',
          },
        ],
        tips: [
          '事件订阅页选"长链接"，添加事件：接收消息 / 消息被 reaction / 取消 reaction',
          '卡片回调也选"长链接"，并添加消息卡片回调',
          '安全设置中如看到 user access token 开关，务必打开',
          '以上配置完毕后需再次"创建版本"并发布',
        ],
      },
      {
        id: 'step-3-7',
        platformGroup: 'feishu',
        title: '完成机器人配对',
        subtitle: '绑定身份，正式开始使用',
        description: '在飞书中向机器人发送任意消息，获取系统返回的配对码（字母+数字）。在终端执行 approve 命令完成绑定，完成后告诉 OpenClaw 学习新技能。',
        xp: 100,
        codeBlocks: [
          {
            language: 'bash',
            description: '完成配对（将 <配对码> 替换为实际收到的码，有效期 5 分钟）',
            code: 'openclaw pairing approve feishu <配对码> --notify',
          },
          {
            language: 'bash',
            description: '诊断工具（遇到问题时运行）',
            code: 'npx https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz doctor',
          },
          {
            language: 'bash',
            description: '自动修复（诊断发现问题后运行）',
            code: 'npx https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/879b06f872058309ef70f49bcd38a71f_Pr8pNIJ9J9.tgz doctor --fix',
          },
        ],
        tips: [
          '配对成功后在对话框输入 /feishu start 确认安装正常',
          '告诉 OpenClaw："学习一下我安装的新飞书插件，列出有哪些能力"',
          '如不想立即授权，可在对话框输入 /feishu auth 后续批量完成',
          '升级插件：npx -y [插件地址] update',
        ],
      },
    ],
  },
  {
    id: 'chapter-4',
    title: 'Gateway 与控制台',
    chapterXp: 200,
    steps: [
      {
        id: 'step-4-1',
        title: '启动 Gateway',
        subtitle: '核心服务，连接一切的枢纽',
        description: 'Gateway 是 OpenClaw 的核心进程，负责会话管理、消息路由和频道连接。如未注册 daemon，需手动运行以下命令启动。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'openclaw gateway run',
            description: '启动 Gateway（前台运行）',
          },
          {
            language: 'bash',
            code: 'openclaw gateway run --port 18789',
            description: '指定端口启动',
          },
        ],
        tips: [
          'Gateway 启动后保持终端窗口开着，或使用 daemon 模式后台运行',
          '看到"Listening on port 18789"说明启动成功',
          '已注册 daemon 的话会自动运行，无需手动启动',
        ],
      },
      {
        id: 'step-4-2',
        title: '访问 Web 控制台',
        subtitle: '浏览器里管理一切',
        description: 'Gateway 启动后，打开浏览器访问本地控制台，可在网页中对话、查看会话历史、管理配置和节点。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            code: 'open http://127.0.0.1:18789/',
            description: '在 macOS 中直接打开控制台（或手动在浏览器输入地址）',
          },
        ],
        tips: [
          '控制台地址：http://127.0.0.1:18789/',
          '支持在线对话、配置修改、会话列表查看',
          '远程访问可配合 Tailscale 使用：https://docs.openclaw.ai/gateway/tailscale',
        ],
      },
      {
        id: 'step-4-3',
        title: '安全配置白名单',
        subtitle: '限制谁可以控制你的 Agent',
        description: '通过 allowFrom 配置白名单，只允许你自己的手机号或账号控制 OpenClaw，防止他人发送指令。',
        xp: 100,
        codeBlocks: [
          {
            language: 'json',
            code: '{\n  "channels": {\n    "whatsapp": {\n      "allowFrom": ["+86138XXXX0000"],\n      "groups": {\n        "*": { "requireMention": true }\n      }\n    }\n  },\n  "messages": {\n    "groupChat": {\n      "mentionPatterns": ["@openclaw"]\n    }\n  }\n}',
            description: '白名单与群聊 @ 配置示例',
          },
        ],
        tips: [
          'allowFrom 填写你的手机号（含国际区号）',
          'requireMention: true 表示群聊中必须 @ 机器人才触发',
          '完整安全配置文档：https://docs.openclaw.ai/gateway/security',
        ],
      },
    ],
  },
  {
    id: 'chapter-5',
    title: 'Skills 安装',
    chapterXp: 200,
    steps: [
      {
        id: 'step-5-1',
        title: '了解 Skills 系统',
        subtitle: 'Skills 是 OpenClaw 的超能力',
        description: 'Skills 是可安装的插件，让 OpenClaw 能执行更多任务：自动化工作流、集成第三方服务、执行代码等。你可以从官方 ClawHub 市场一键安装。',
        xp: 40,
        tips: [
          'Skills 相当于 ChatGPT Plugins，但运行在本地服务器上',
          '每个 Skill 都是独立模块，可随时启用/禁用',
          '支持自定义开发自己的 Skill',
          '查看 Skills 文档：https://docs.openclaw.ai/skills',
        ],
      },
      {
        id: 'step-5-2',
        title: '安装 clawhub Skill',
        subtitle: '第一个必装 Skill：访问 ClawHub 市场的入口',
        description: '安装官方 clawhub skill，它能让 OpenClaw 直接在聊天中搜索、安装和管理 ClawHub 市场上的其他 Skills，是整个 Skills 生态的入口。',
        xp: 50,
        codeBlocks: [
          {
            language: 'bash',
            description: '安装 clawhub skill',
            code: 'openclaw skills install clawhub',
          },
          {
            language: 'bash',
            description: '验证安装成功（clawhub 应出现在列表中）',
            code: 'openclaw skills list',
          },
        ],
        tips: [
          '安装成功后告诉 OpenClaw："学习一下刚安装的 clawhub skill"',
          '之后可以直接说："用 clawhub 帮我找一个日历管理 skill"',
          'clawhub skill 安装后会自动重载，无需重启 Gateway',
        ],
      },
      {
        id: 'step-5-3',
        title: '在聊天中使用 Skill',
        subtitle: '自然语言调用你的新能力',
        description: 'Skill 安装后可直接在聊天中用自然语言调用。比如发送"用日历 Skill 创建明天下午 3 点的会议"，OpenClaw 会自动识别并执行。',
        xp: 50,
        tips: [
          '无需记忆命令，直接用自然语言描述你要做的事',
          '发送 /skills 查看所有可用 Skill 及其功能',
          'OpenClaw 会自动选择最合适的 Skill 来完成任务',
          '多个 Skill 可协同工作，完成复杂的多步骤任务',
        ],
      },
      {
        id: 'step-5-4',
        title: '管理已安装的 Skills',
        subtitle: '更新、禁用、卸载全掌握',
        description: '使用命令行或 Web 控制台管理已安装的 Skills，包括查看状态、更新到新版本和卸载不需要的 Skill。',
        xp: 40,
        codeBlocks: [
          {
            language: 'bash',
            description: '更新某个 Skill 到最新版',
            code: 'openclaw skills update <skill-name>',
          },
          {
            language: 'bash',
            description: '卸载某个 Skill',
            code: 'openclaw skills uninstall <skill-name>',
          },
        ],
        tips: [
          '定期检查 Skill 更新，新版本可能带来新功能和 bug 修复',
          '也可以在 Web 控制台 http://127.0.0.1:18789/ 的 Skills 页面管理',
        ],
      },
      {
        id: 'step-5-5',
        type: 'link-cta',
        title: '探索 ClawHub Skill 市场',
        subtitle: '发现更多精彩 Skills，扩展你的 AI 能力',
        description: 'ClawHub 是 OpenClaw 的官方 Skill 市场，汇集了社区贡献的各类 Skills，覆盖效率工具、数据处理、智能自动化等场景。点击下方按钮前往探索！',
        xp: 20,
        tips: [
          '在 ClawHub 可以发布你自己开发的 Skill，与社区共享',
          '关注 Skills 的 Star 数和下载量，选择最受欢迎的',
          '每周都有新 Skill 上架，定期来逛逛！',
        ],
      },
    ],
  },
]

export const LEVELS = [
  { level: 1, title: '入门虾兵', minXp: 0, maxXp: 150, color: 'oklch(0.65 0.18 142)' },
  { level: 2, title: '频道连接者', minXp: 150, maxXp: 350, color: 'oklch(0.65 0.22 262)' },
  { level: 3, title: 'Gateway 指挥官', minXp: 350, maxXp: 600, color: 'oklch(0.75 0.18 60)' },
  { level: 4, title: 'Skills 集成师', minXp: 600, maxXp: 800, color: 'oklch(0.65 0.22 310)' },
  { level: 5, title: '太空龙虾神', minXp: 800, maxXp: 1000, color: 'oklch(0.65 0.22 27)' },
]

export function getCurrentLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getTotalSteps(): number {
  return CHAPTERS.reduce((sum, ch) => sum + ch.steps.length, 0)
}

export function getAllSteps(): Array<{ step: TutorialStep; chapterIndex: number; stepIndex: number }> {
  const result: Array<{ step: TutorialStep; chapterIndex: number; stepIndex: number }> = []
  CHAPTERS.forEach((chapter, ci) => {
    chapter.steps.forEach((step, si) => {
      result.push({ step, chapterIndex: ci, stepIndex: si })
    })
  })
  return result
}

export function getOrderedStepIds(selectedPlatform: string | null = null): string[] {
  return CHAPTERS.flatMap((ch) =>
    ch.steps.filter((s) => !s.platformGroup || s.platformGroup === selectedPlatform)
  ).map((s) => s.id)
}
