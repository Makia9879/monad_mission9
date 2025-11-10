# Monad Maze Explorer - 素材需求清单

**文档版本**: 1.0
**创建日期**: 2025-11-08
**负责人**: [待填写]

---

## 📋 素材收集优先级

### 🔴 P0 - 必需素材（立即收集）
这些素材是项目启动的前置条件，请优先准备：

- [ ] Monad Dapp 数据列表（15-20 个项目）
- [ ] Monad 主网网络配置信息
- [ ] Monad 品牌配色方案

### 🟡 P1 - 重要素材（开发中期需要）
开发进行到 Phase 9 时需要：

- [ ] Dapp Logo 图片（15-20 个）
- [ ] Monad 主 Logo
- [ ] 项目介绍文案

### 🟢 P2 - 可选素材（后期优化）
用于提升用户体验，可以在测试阶段补充：

- [ ] 纹理素材（墙壁、地面）
- [ ] 音效（收集、点击、脚步）
- [ ] 背景音乐

---

## 一、核心数据素材

### 1. Monad Dapp 列表数据 🔴

**描述**: 在 Monad 生态系统中运行的所有 Dapp 的详细信息

**数量要求**: 最少 15-20 个 Dapp，越多越好

**数据格式**: JSON 或 Excel

#### JSON 格式模板

```json
{
  "dapps": [
    {
      "id": "monad-swap",
      "name": "Monad Swap",
      "category": "DeFi",
      "subcategory": "DEX",

      "description": "Monad 生态系统中首个去中心化交易所",
      "longDescription": "Monad Swap 是一个基于 AMM 的去中心化交易所，提供低滑点、高流动性的交易体验。支持多种代币交易对，并提供流动性挖矿奖励。",

      "url": "https://monadswap.xyz",
      "logo": "/logos/monad-swap.png",
      "color": "#FF0000",
      "icon": "💰",

      "metrics": {
        "tvl": 10000000,
        "users": 5000,
        "volume24h": 500000,
        "transactions": 10000
      },

      "social": {
        "twitter": "https://twitter.com/monadswap",
        "discord": "https://discord.gg/monadswap",
        "telegram": "https://t.me/monadswap",
        "github": "https://github.com/monadswap"
      },

      "contracts": {
        "router": "0x1234567890abcdef1234567890abcdef12345678",
        "factory": "0xabcdef1234567890abcdef1234567890abcdef12"
      },

      "tags": ["AMM", "流动性挖矿", "治理代币"],

      "status": "live",
      "featured": true,
      "new": false,
      "verified": true
    }
  ],
  "lastUpdated": "2025-11-08T00:00:00Z",
  "version": "1.0"
}
```

#### Excel 格式模板

如果使用 Excel，请按照以下列名填写：

| 列名 | 说明 | 必填 | 示例 |
|------|------|------|------|
| id | 唯一标识符（英文，小写，用-连接） | ✅ | monad-swap |
| name | Dapp 名称 | ✅ | Monad Swap |
| category | 类别 | ✅ | DeFi / NFT / Gaming / DAO / Infrastructure |
| subcategory | 子类别 | ❌ | DEX / Lending / Marketplace |
| description | 简短描述（50字内） | ✅ | 去中心化交易所 |
| longDescription | 详细描述（200字内） | ❌ | 提供低滑点、高流动性... |
| url | 官网链接 | ✅ | https://monadswap.xyz |
| logo | Logo 文件名 | ✅ | monad-swap.png |
| color | 主题色（十六进制） | ✅ | #FF0000 |
| icon | Emoji 图标 | ❌ | 💰 |
| tvl | 总锁仓价值（美元） | ❌ | 10000000 |
| users | 用户数量 | ❌ | 5000 |
| volume24h | 24小时交易量 | ❌ | 500000 |
| twitter | Twitter 链接 | ❌ | https://twitter.com/... |
| discord | Discord 链接 | ❌ | https://discord.gg/... |
| telegram | Telegram 链接 | ❌ | https://t.me/... |
| github | GitHub 链接 | ❌ | https://github.com/... |
| tags | 标签（逗号分隔） | ❌ | AMM,流动性挖矿,治理代币 |
| status | 状态 | ✅ | live / beta / coming-soon |
| featured | 是否精选 | ❌ | true / false |
| verified | 是否已验证 | ❌ | true / false |

#### 类别说明

请将每个 Dapp 归类到以下类别之一：

| 类别 | 英文名 | 图标 | 颜色建议 | 包含的项目类型 |
|------|--------|------|----------|----------------|
| DeFi | DeFi | 💰 | #FF0000 (红色) | DEX, 借贷, 稳定币, 收益聚合器 |
| NFT | NFT | 🎨 | #00FF00 (绿色) | NFT 市场, PFP 项目, 创作平台 |
| Gaming | Gaming | 🎮 | #0000FF (蓝色) | 链游, GameFi, Play2Earn |
| DAO | DAO | 🏛️ | #FFFF00 (黄色) | 治理, DAO 工具, 投票平台 |
| Infrastructure | Infrastructure | 🔧 | #FF00FF (紫色) | 预言机, 跨链桥, 钱包, 开发工具 |

#### 数据来源建议

1. **官方生态页面**: https://www.monad.xyz/ecosystem
2. **DeFiLlama**: https://defillama.com (查询 TVL 等数据)
3. **项目官网**: 直接访问各 Dapp 官网获取最新信息
4. **社区收集**: Twitter, Discord, Telegram 社区推荐

#### 提交文件名

- JSON 格式: `dapps.json`
- Excel 格式: `dapps.xlsx`

---

### 2. Monad 主网网络配置 🔴

**描述**: 用于钱包连接和链上交互的网络配置信息

#### 需要的信息

```json
{
  "network": {
    "chainId": "0x...",
    "chainName": "Monad",
    "rpcUrls": [
      "https://rpc.monad.xyz"
    ],
    "nativeCurrency": {
      "name": "MONAD",
      "symbol": "MONAD",
      "decimals": 18
    },
    "blockExplorerUrls": [
      "https://explorer.monad.xyz"
    ]
  }
}
```

#### 信息清单

- [ ] Chain ID（十进制和十六进制）
- [ ] RPC URL（主节点 + 备用节点）
- [ ] 原生代币名称
- [ ] 原生代币符号
- [ ] 原生代币精度（通常是 18）
- [ ] 区块浏览器 URL

#### 获取方式

1. 访问 Monad 官方文档
2. 查看 ChainList: https://chainlist.org
3. 联系 Monad 官方团队

#### 提交文件名

`network-config.json`

---

## 二、视觉素材

### 3. Monad 品牌素材 🔴

#### 3.1 Logo

**需要的文件**:
- Monad 主 Logo（完整版）
- Monad 图标（Icon，正方形）

**格式要求**:
- 文件格式: PNG（透明背景）或 SVG（矢量）
- PNG 尺寸: 512x512px 或更高
- 背景: 必须透明

**文件命名**:
- `monad-logo.png` 或 `monad-logo.svg`（完整 Logo）
- `monad-icon.png` 或 `monad-icon.svg`（图标）

**获取方式**:
- Monad 官方媒体资源包
- 官网下载
- 联系 Monad 品牌团队

#### 3.2 配色方案

**需要的颜色**:

| 颜色用途 | 名称 | 十六进制代码 | 示例 |
|----------|------|--------------|------|
| 主色 | Primary | #?????? | 🟦 |
| 次色 | Secondary | #?????? | 🟪 |
| 强调色 | Accent | #?????? | 🟩 |
| 背景色 | Background | #?????? | ⬛ |
| 文字色 | Text | #?????? | ⬜ |

**提交格式**:

创建一个 `colors.json` 文件：

```json
{
  "brand": {
    "primary": "#667eea",
    "secondary": "#764ba2",
    "accent": "#00ff00",
    "background": "#1a1a2e",
    "text": "#ffffff"
  },
  "categories": {
    "defi": "#FF0000",
    "nft": "#00FF00",
    "gaming": "#0000FF",
    "dao": "#FFFF00",
    "infrastructure": "#FF00FF"
  }
}
```

**获取方式**:
- Monad 品牌指南
- 官网配色提取
- 使用浏览器插件如 ColorZilla 从官网提取

---

### 4. Dapp Logo 图片 🟡

**描述**: 每个 Dapp 的品牌 Logo

**数量**: 与 Dapp 数据列表数量一致（15-20 个）

**格式要求**:
- 文件格式: PNG（推荐透明背景）或 JPG
- 尺寸: 256x256px 或 512x512px（正方形）
- 文件大小: 每个 < 200KB

**命名规则**:
使用 Dapp ID 作为文件名，例如：
- `monad-swap.png`
- `monad-lend.png`
- `monad-art.png`

**文件夹结构**:
```
logos/
├── monad-swap.png
├── monad-lend.png
├── monad-art.png
└── ...
```

**获取方式**:
1. 从各 Dapp 官网下载
2. 从 Twitter 头像获取
3. 从 GitHub 仓库获取
4. 联系项目方索取

**备选方案**:
如果某些 Logo 无法获取，可以暂时留空，我会用彩色圆形占位符代替。

---

### 5. 纹理素材（可选）🟢

**描述**: 用于迷宫墙壁、地面的纹理图片

#### 需要的纹理

| 纹理名称 | 用途 | 推荐尺寸 | 格式 |
|----------|------|----------|------|
| wall.jpg | 迷宫墙壁 | 1024x1024px | JPG/PNG |
| floor.jpg | 迷宫地面 | 1024x1024px | JPG/PNG |
| ceiling.jpg | 迷宫天花板（可选） | 1024x1024px | JPG/PNG |

**风格要求**:
- 可平铺（Tileable）
- 科技感 / 未来感
- 与 Monad 品牌风格一致

**文件夹结构**:
```
textures/
├── wall.jpg
├── floor.jpg
└── ceiling.jpg
```

**获取方式**:
- 免费纹理网站:
  - https://www.textures.com
  - https://polyhaven.com/textures
  - https://www.poliigon.com
- AI 生成（Midjourney, DALL-E）
- 自行设计

**备选方案**:
如果没有，我会使用纯色材质或 Three.js 内置材质。

---

## 三、音频素材

### 6. 音效 🟢

**描述**: 游戏中的各种音效

#### 需要的音效

| 音效名称 | 用途 | 时长 | 文件名 |
|----------|------|------|--------|
| 宝石收集音效 | 玩家收集到 Dapp | 0.5-1s | collect.mp3 |
| 脚步声 | 玩家移动 | 0.3-0.5s | footstep.mp3 |
| UI 点击音效 | 点击按钮 | 0.2-0.3s | click.mp3 |
| 成就解锁音效 | 解锁成就 | 1-2s | achievement.mp3 |
| 胜利音效 | 完成游戏 | 2-3s | victory.mp3 |

**格式要求**:
- 文件格式: MP3 或 OGG
- 采样率: 44.1kHz
- 比特率: 128kbps 或更高
- 文件大小: 每个 < 100KB

**文件夹结构**:
```
sounds/
├── collect.mp3
├── footstep.mp3
├── click.mp3
├── achievement.mp3
└── victory.mp3
```

**获取方式**:
- 免费音效网站:
  - https://freesound.org
  - https://mixkit.co/free-sound-effects
  - https://soundbible.com
- AI 生成音效
- 自行录制

**备选方案**:
音效是可选的，如果没有也不影响核心功能。

---

### 7. 背景音乐 🟢

**描述**: 游戏过程中播放的背景音乐

**格式要求**:
- 文件格式: MP3
- 时长: 2-3 分钟（可循环）
- 比特率: 192kbps
- 文件大小: < 5MB

**风格要求**:
- 轻松、探索感
- 节奏舒缓
- 不干扰游戏体验
- 科技感 / 电子音乐

**文件命名**:
`background-music.mp3`

**获取方式**:
- 免费音乐网站:
  - https://incompetech.com
  - https://www.bensound.com
  - https://pixabay.com/music
- AI 生成音乐（Suno AI, Udio）
- 委托音乐制作人创作

**版权要求**:
确保音乐可用于商业项目，推荐使用 CC0 或 CC BY 许可的音乐。

**备选方案**:
背景音乐是完全可选的，可以在后期补充。

---

## 四、文档和文案

### 8. 项目介绍文案 🟡

**描述**: 用于项目宣传和介绍的文案

#### 需要的内容

**8.1 项目 Slogan（一句话）**
- 要求: 简洁有力，15 字以内
- 示例: "探索 Monad 生态，从迷宫冒险开始"
- [ ] 你的 Slogan: ___________________________

**8.2 项目简介（电梯演讲）**
- 要求: 100 字以内，说明项目是什么、解决什么问题
- 示例:
  ```
  Monad Maze Explorer 是一个创新的 3D 游戏化 Dapp 发现平台。
  我们将枯燥的 Dapp 目录变成有趣的迷宫探索游戏，让用户在
  玩乐中发现 Monad 生态系统中的优质项目。通过 Web3 集成和
  智能推荐算法，为每位用户提供个性化的探索体验。
  ```
- [ ] 你的简介: ___________________________

**8.3 核心特点（3-5 个亮点）**

示例：
- 🎮 **沉浸式 3D 体验**: Three.js 渲染的精美迷宫世界
- 🧠 **智能推荐系统**: 基于 AI 的个性化 Dapp 推荐
- 🔗 **Web3 原生**: 钱包连接、链上数据分析
- 🏆 **游戏化激励**: 成就系统、排行榜、每日挑战
- 🌍 **社区驱动**: 开源、可扩展、社区贡献

请列出你的核心特点：
- [ ] 特点 1: ___________________________
- [ ] 特点 2: ___________________________
- [ ] 特点 3: ___________________________
- [ ] 特点 4: ___________________________
- [ ] 特点 5: ___________________________

**提交文件名**: `project-description.md`

---

### 9. 团队信息 🟡

**描述**: 参赛团队成员信息（Mission 9 要求 2-4 人团队）

#### 团队信息表格

| 姓名/昵称 | 角色 | 职责 | GitHub/Twitter |
|-----------|------|------|----------------|
| [填写] | 项目负责人 | 整体协调、需求管理 | @xxx |
| [填写] | 前端开发 | 3D 渲染、UI 开发 | @xxx |
| [填写] | Web3 开发 | 智能合约、钱包集成 | @xxx |
| [填写] | UI/UX 设计 | 界面设计、用户体验 | @xxx |

**提交文件名**: `team.md`

---

## 五、技术配置

### 10. API 端点（如果有）🟢

**描述**: 如果 Monad 提供了官方 API，请提供端点信息

#### API 清单

- [ ] Dapp 列表 API: ___________________________
- [ ] Dapp 详情 API: ___________________________
- [ ] TVL/指标数据 API: ___________________________
- [ ] 用户数据 API: ___________________________

#### API 认证

- [ ] 是否需要 API Key: 是 / 否
- [ ] 如果需要，请提供 API Key: ___________________________

**提交文件名**: `api-config.json`

**备选方案**:
如果没有官方 API，我们将使用本地 JSON 文件作为数据源。

---

## 六、素材提交清单

### 提交前检查

#### 必需素材 🔴
- [ ] `dapps.json` 或 `dapps.xlsx` - Dapp 数据列表
- [ ] `network-config.json` - Monad 网络配置
- [ ] `colors.json` - 品牌配色方案

#### 重要素材 🟡
- [ ] `logos/` 文件夹 - Dapp Logo 图片（15-20 个）
- [ ] `monad-logo.png` - Monad 主 Logo
- [ ] `project-description.md` - 项目文案
- [ ] `team.md` - 团队信息

#### 可选素材 🟢
- [ ] `textures/` 文件夹 - 纹理图片
- [ ] `sounds/` 文件夹 - 音效文件
- [ ] `background-music.mp3` - 背景音乐
- [ ] `api-config.json` - API 配置（如果有）

---

## 七、素材提交方式

### 推荐的文件夹结构

```
monad-maze-assets/
├── README.md                   # 素材说明文档
├── data/
│   ├── dapps.json             # 或 dapps.xlsx
│   ├── network-config.json
│   └── api-config.json        # 可选
├── images/
│   ├── logos/
│   │   ├── monad-swap.png
│   │   ├── monad-lend.png
│   │   └── ...
│   ├── brand/
│   │   ├── monad-logo.png
│   │   └── monad-icon.png
│   └── textures/              # 可选
│       ├── wall.jpg
│       └── floor.jpg
├── sounds/                    # 可选
│   ├── collect.mp3
│   ├── footstep.mp3
│   └── ...
├── music/                     # 可选
│   └── background-music.mp3
├── config/
│   └── colors.json
└── docs/
    ├── project-description.md
    └── team.md
```

### 提交方式（任选一种）

#### 方式 1: 云盘分享（推荐）
- Google Drive
- Dropbox
- 百度网盘
- OneDrive

请将所有文件打包上传，并分享链接。

#### 方式 2: GitHub
如果文件较小（< 100MB），可以直接提交到项目仓库：
```bash
git checkout -b assets
# 将文件放到 public/assets/ 目录
git add public/assets/
git commit -m "Add project assets"
git push origin assets
```

#### 方式 3: 压缩包
将所有文件打包成 ZIP 文件：
- 文件名: `monad-maze-assets.zip`
- 通过邮件或聊天工具发送

---

## 八、时间规划

### 素材收集时间表

| 阶段 | 素材类别 | 预计时间 | 截止日期 |
|------|----------|----------|----------|
| 第一批 | 🔴 必需素材 | 1-2 天 | [填写] |
| 第二批 | 🟡 重要素材 | 3-5 天 | [填写] |
| 第三批 | 🟢 可选素材 | 后期补充 | [填写] |

### 建议工作流程

**Day 1-2: 收集必需素材**
1. 从 Monad 生态页面整理 Dapp 列表
2. 查找 Monad 网络配置信息
3. 提取品牌配色方案

**Day 3-5: 收集重要素材**
4. 下载各 Dapp 的 Logo
5. 获取 Monad 官方 Logo
6. 撰写项目文案

**Day 6+: 补充可选素材**
7. 寻找或制作纹理图片
8. 收集音效和背景音乐

---

## 九、快速启动方案

### 如果你现在没有完整素材

不用担心！我可以先用模拟数据开始开发：

**临时方案**:
1. **Dapp 数据**: 创建 5-10 个虚构项目用于测试
2. **Logo**: 使用彩色圆形占位符
3. **配色**: 使用通用的紫色渐变主题
4. **纹理**: 使用纯色材质
5. **音效**: 暂不添加

**替换计划**:
等真实素材准备好后，可以快速替换，不影响开发进度。

---

## 十、常见问题

### Q1: 我不知道 Monad 有哪些 Dapp，怎么办？
**A**: 访问 https://www.monad.xyz/ecosystem 查看官方生态列表，或者在 Twitter/Discord 询问社区。

### Q2: 某些 Dapp 的数据（TVL、用户数）找不到怎么办？
**A**: 这些数据是可选的，可以暂时留空或填写 0。我们可以后期补充或使用估算值。

### Q3: 我不会用 Photoshop，如何处理 Logo 图片？
**A**: 可以使用在线工具：
- 去除背景: https://www.remove.bg
- 调整尺寸: https://www.iloveimg.com/resize-image
- 转换格式: https://cloudconvert.com

### Q4: 能否先提供部分素材，后续再补充？
**A**: 当然可以！建议先提供🔴必需素材（5-10 个 Dapp 数据即可），其他的可以逐步补充。

### Q5: 音效和音乐的版权问题怎么处理？
**A**: 使用标注为 CC0（公共领域）或 CC BY（署名）许可的素材，或者自己创作/委托创作。

---

## 十一、联系方式

### 素材提交或咨询请联系

- **项目负责人**: [填写姓名]
- **邮箱**: [填写邮箱]
- **Discord**: [填写 Discord ID]
- **Telegram**: [填写 Telegram]

### 提交确认

当你准备好素材后，请在下方打勾确认：

- [ ] 我已准备好所有🔴必需素材
- [ ] 我已阅读所有要求和规范
- [ ] 我已按照文件夹结构组织素材
- [ ] 我已通过 [方式] 提交素材

**提交日期**: ___________________________

---

## 附录

### A. 参考资源

- Monad 官网: https://www.monad.xyz
- Monad 生态: https://www.monad.xyz/ecosystem
- Monad 文档: [待补充]
- Monad Twitter: https://twitter.com/monad_xyz
- Monad Discord: [待补充]

### B. 工具推荐

**图片处理**:
- Remove.bg - 去除背景
- TinyPNG - 图片压缩
- Squoosh - 图片优化

**颜色工具**:
- ColorZilla - 浏览器取色插件
- Coolors - 配色方案生成
- Adobe Color - 配色探索

**音频工具**:
- Audacity - 音频编辑
- Online Audio Converter - 格式转换

**数据整理**:
- Google Sheets - 在线表格
- JSON Editor Online - JSON 编辑
- VS Code - 代码编辑器

---

**文档版本**: 1.0
**最后更新**: 2025-11-08
**状态**: 待收集

祝收集顺利！如有任何问题，随时联系开发团队。
