# Monad Mission 9 - 迷宫寻宝 Dapp 发现层实现方案

**项目名称**: Monad Maze Explorer
**文档版本**: 1.0
**创建日期**: 2025-11-08
**更新日期**: 2025-11-08

---

## 目录

1. [项目概述](#项目概述)
2. [核心创意](#核心创意)
3. [功能设计](#功能设计)
4. [技术实现](#技术实现)
5. [UI/UX 设计](#uiux-设计)
6. [游戏化元素](#游戏化元素)
7. [社交功能](#社交功能)
8. [Mission 9 要求检查](#mission-9-要求检查)
9. [开发路线图](#开发路线图)
10. [数据结构设计](#数据结构设计)

---

## 项目概述

### 背景
Mission 9 要求构建 Monad 主网的 dapp 发现层和推荐引擎，帮助用户以创意、沉浸式的方式找到他们需要的 dapps。

### 解决方案
将现有的 3D 迷宫寻宝游戏转化为一个游戏化的 Monad dapp 发现平台。用户通过探索 3D 迷宫来发现和了解 Monad 生态系统中的各种 dapps。

### 核心价值主张
- **趣味性**: 将枯燥的 dapp 浏览变成有趣的探索游戏
- **沉浸式**: 3D 环境提供独特的用户体验
- **智能推荐**: 基于用户行为的个性化推荐
- **可发现性**: 迷雾战争机制鼓励主动探索

---

## 核心创意

### 1. 迷宫 = Monad 生态系统

```
迷宫布局设计：
┌─────────────────────────────────┐
│  DeFi Zone    │  NFT Zone       │
│   (红色区域)   │   (绿色区域)     │
├─────────────────────────────────┤
│  Gaming Zone  │  DAO Zone       │
│   (蓝色区域)   │   (黄色区域)     │
├─────────────────────────────────┤
│  Infrastructure Zone            │
│   (紫色区域)                     │
└─────────────────────────────────┘
```

**特点**:
- 迷宫的不同区域代表不同的 dapp 类别
- 区域大小反映该类别的 dapp 数量
- 墙壁和地板纹理融入 Monad 品牌元素

### 2. 宝藏 = Dapps

**宝石颜色与类别对应**:
| 颜色 | 类别 | 图标 | 示例 |
|------|------|------|------|
| 🔴 红宝石 | DeFi | 💰 | Monad Swap, Monad Lend |
| 🟢 绿宝石 | NFT | 🎨 | Monad Art, Monad Marketplace |
| 🔵 蓝宝石 | Gaming | 🎮 | Monad Games, Play2Earn |
| 🟡 黄宝石 | DAO | 🏛️ | Monad DAO, Governance |
| 🟣 紫宝石 | Infrastructure | 🔧 | Oracles, Bridges |

**视觉效果**:
- 宝石大小 ∝ Dapp TVL/用户数
- 旋转动画 + 粒子效果
- 特殊光晕表示新上线/热门 dapp
- 已访问的 dapp 显示为半透明

### 3. 迷雾战争 = 探索机制

**视野系统**:
```javascript
视野类型：
- 未探索区域：完全黑暗
- 当前视野：完全可见（圆形范围，半径可配置）
- 已探索区域：灰色半透明（记忆效果）
```

**探索激励**:
- 探索进度条显示整体发现率
- 解锁隐藏成就
- 发现稀有/新上线 dapp 有特殊奖励

---

## 功能设计

### 1. Dapp 信息集成

#### Dapp 数据模型
```javascript
{
  id: "monad-swap-001",
  name: "Monad Swap",
  category: "DeFi",
  subcategory: "DEX",

  // 基础信息
  description: "Monad 生态系统中首个去中心化交易所",
  longDescription: "支持多种代币交易，低滑点，高流动性...",
  url: "https://monadswap.xyz",

  // 视觉元素
  color: "#FF0000",
  logo: "https://cdn.monad.xyz/logos/monadswap.png",
  icon: "💰",

  // 统计数据
  metrics: {
    tvl: 10000000,        // $10M
    users: 5000,          // 5000 用户
    volume24h: 500000,    // 24h 交易量
    transactions: 10000   // 总交易数
  },

  // 社交链接
  social: {
    twitter: "https://twitter.com/monadswap",
    discord: "https://discord.gg/monadswap",
    telegram: "https://t.me/monadswap",
    github: "https://github.com/monadswap"
  },

  // 智能合约
  contracts: {
    router: "0x...",
    factory: "0x..."
  },

  // 标签
  tags: ["AMM", "流动性挖矿", "治理代币"],

  // 状态
  status: "live",        // live | beta | coming-soon
  featured: true,        // 是否为精选
  new: false,           // 是否为新上线
  verified: true,       // 是否已验证

  // 游戏属性
  position: { x: 10, y: 5 },  // 迷宫中的位置
  size: 1.2,                  // 宝石大小
  glowIntensity: 0.8          // 发光强度
}
```

#### 数据来源
1. **官方 API** (优先)
   ```javascript
   fetch('https://api.monad.xyz/v1/dapps')
   ```

2. **本地数据库** (备选)
   ```javascript
   // public/data/dapps.json
   {
     "dapps": [...],
     "lastUpdated": "2025-11-08T00:00:00Z"
   }
   ```

3. **社区贡献** (扩展)
   - GitHub 仓库提交 PR 添加新 dapp
   - 审核机制确保质量

### 2. 交互式 Dapp 详情

#### 触发方式
- 玩家角色靠近宝石时自动显示简要信息
- 点击/触碰宝石时显示完整详情卡片
- 鼠标悬停显示快速预览

#### 详情卡片布局
```
┌──────────────────────────────────┐
│  [Logo]  Monad Swap         [X]  │
│  ──────────────────────────────  │
│  Category: DeFi > DEX            │
│                                  │
│  Monad 生态系统中首个去中心化...  │
│                                  │
│  📊 关键指标                      │
│  TVL: $10M  |  Users: 5K        │
│  24h Vol: $500K                  │
│                                  │
│  🏷️ 标签                         │
│  [AMM] [流动性挖矿] [治理代币]    │
│                                  │
│  🔗 链接                         │
│  [Visit Dapp] [Twitter] [Docs]  │
│                                  │
│  [⭐ Add to Favorites]           │
│  [✓ Mark as Visited]             │
└──────────────────────────────────┘
```

#### 交互功能
- **Visit Dapp**: 在新标签页打开 dapp
- **Connect Wallet**: 测试钱包兼容性
- **Add to Favorites**: 收藏到个人列表
- **Share**: 分享到社交媒体
- **Report**: 报告问题或更新信息

### 3. 智能推荐系统

#### 推荐算法

**3.1 协同过滤**
```javascript
// 基于用户行为的推荐
function collaborativeFiltering(userHistory) {
  // 1. 找到相似用户
  const similarUsers = findSimilarUsers(userHistory);

  // 2. 获取相似用户喜欢的 dapps
  const recommendations = getSimilarUserPreferences(similarUsers);

  // 3. 过滤用户已访问的
  return recommendations.filter(d => !userHistory.includes(d));
}
```

**3.2 内容推荐**
```javascript
// 基于 dapp 属性的推荐
function contentBasedFiltering(visitedDapps) {
  // 1. 分析用户偏好的类别和标签
  const userProfile = buildUserProfile(visitedDapps);

  // 2. 找到相似的 dapps
  return findSimilarDapps(userProfile);
}
```

**3.3 热度推荐**
```javascript
// 基于整体热度的推荐
function trendingRecommendations() {
  return dapps
    .sort((a, b) => b.metrics.volume24h - a.metrics.volume24h)
    .slice(0, 10);
}
```

**3.4 组合策略**
```javascript
function hybridRecommendation(user) {
  const collaborative = collaborativeFiltering(user.history) * 0.4;
  const content = contentBasedFiltering(user.visited) * 0.3;
  const trending = trendingRecommendations() * 0.2;
  const personalized = personalizedScore(user) * 0.1;

  return mergeAndRank([collaborative, content, trending, personalized]);
}
```

#### 推荐位置
- **迷宫入口**: 热门推荐 (前 5 个)
- **探索过程**: 根据当前位置推荐附近相关 dapps
- **侧边栏**: 个性化推荐列表 (实时更新)

### 4. Web3 集成

#### 钱包连接
```javascript
// src/web3/WalletConnector.js

class WalletConnector {
  async connect() {
    // 支持多种钱包
    const wallets = ['MetaMask', 'WalletConnect', 'Coinbase Wallet'];

    // 检测 Monad 网络
    await this.switchToMonadNetwork();

    // 获取用户地址
    this.address = await this.getAddress();
  }

  async switchToMonadNetwork() {
    const monadNetwork = {
      chainId: '0x...', // Monad Mainnet Chain ID
      chainName: 'Monad',
      rpcUrls: ['https://rpc.monad.xyz'],
      nativeCurrency: {
        name: 'MONAD',
        symbol: 'MONAD',
        decimals: 18
      },
      blockExplorerUrls: ['https://explorer.monad.xyz']
    };

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [monadNetwork]
    });
  }
}
```

#### 链上数据读取
```javascript
class OnChainAnalyzer {
  async getUserHistory(address) {
    // 读取用户在 Monad 上的交互历史
    const transactions = await this.getTransactions(address);

    // 分析用户使用过的协议
    const protocols = this.analyzeProtocols(transactions);

    return {
      totalTx: transactions.length,
      protocolsUsed: protocols,
      firstTx: transactions[0].timestamp,
      categories: this.categorizeActivity(transactions)
    };
  }

  async analyzeUserPreferences(address) {
    const history = await this.getUserHistory(address);

    // 根据链上行为生成推荐
    return {
      favoriteCategories: this.getFavoriteCategories(history),
      riskProfile: this.assessRiskProfile(history),
      recommendedDapps: this.generateRecommendations(history)
    };
  }
}
```

#### 个性化体验
```javascript
// 连接钱包后的个性化功能

1. **已访问标记**
   - 检测用户钱包交互过的合约
   - 在迷宫中标记已使用的 dapps（特殊图标）

2. **智能路径规划**
   - 根据用户历史推荐探索路线
   - 高亮推荐访问的 dapps

3. **成就系统**
   - 基于链上活动解锁成就
   - "DeFi 老手": 在 5 个以上 DeFi 协议交易过
```

### 5. 数据更新机制

#### 实时数据同步
```javascript
class DappDataSync {
  constructor() {
    this.updateInterval = 5 * 60 * 1000; // 5分钟
  }

  async startSync() {
    setInterval(async () => {
      // 更新 TVL、用户数等动态数据
      await this.updateMetrics();

      // 检查新上线的 dapps
      await this.checkNewDapps();

      // 更新热度排名
      await this.updateTrending();
    }, this.updateInterval);
  }

  async updateMetrics() {
    const dapps = await fetch('https://api.monad.xyz/v1/dapps/metrics');

    dapps.forEach(dapp => {
      // 更新宝石大小和光效
      this.updateTreasureVisuals(dapp);
    });
  }
}
```

---

## 技术实现

### 新增模块结构

```
src/
├── web3/
│   ├── WalletConnector.js      # 钱包连接
│   ├── OnChainAnalyzer.js      # 链上数据分析
│   └── NetworkConfig.js        # Monad 网络配置
├── dapp/
│   ├── DappManager.js          # Dapp 数据管理
│   ├── DappCard.js             # Dapp 详情卡片
│   ├── DappRecommender.js      # 推荐引擎
│   └── DappDataSync.js         # 数据同步
├── analytics/
│   ├── UserBehavior.js         # 用户行为追踪
│   └── RecommendationEngine.js # 推荐算法
└── utils/
    ├── APIClient.js            # API 客户端
    └── CategoryMapper.js       # 类别映射
```

### 修改现有模块

#### 1. Treasure.js 增强
```javascript
// src/treasure/Treasure.js

import * as THREE from 'three';

export class Treasure {
  constructor(dappData, position) {
    this.dapp = dappData;  // 新增：关联 dapp 数据
    this.position = position;

    // 根据 dapp 数据定制宝石
    this.color = dappData.color;
    this.size = this.calculateSize(dappData.metrics.tvl);
    this.glowIntensity = dappData.featured ? 1.0 : 0.5;

    this.createMesh();
    this.createParticles();  // 新增：粒子效果
    this.createLabel();      // 新增：悬浮标签
  }

  calculateSize(tvl) {
    // TVL 越大，宝石越大
    const minSize = 0.5;
    const maxSize = 2.0;
    const normalizedTVL = Math.log10(tvl + 1) / Math.log10(1000000000);
    return minSize + (maxSize - minSize) * normalizedTVL;
  }

  createParticles() {
    // 创建环绕宝石的粒子效果
    const particleCount = this.dapp.featured ? 100 : 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = this.size * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: this.color,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });

    this.particles = new THREE.Points(geometry, material);
    this.mesh.add(this.particles);
  }

  createLabel() {
    // 创建悬浮在宝石上方的文字标签
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'Bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(this.dapp.name, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });

    this.label = new THREE.Sprite(material);
    this.label.scale.set(2, 0.5, 1);
    this.label.position.y = this.size + 1;

    this.mesh.add(this.label);
    this.label.visible = false; // 默认隐藏，靠近时显示
  }

  update(delta, playerPosition) {
    // 旋转动画
    this.mesh.rotation.y += delta * 0.5;

    // 粒子旋转
    if (this.particles) {
      this.particles.rotation.y += delta * 0.2;
    }

    // 根据玩家距离显示/隐藏标签
    const distance = this.position.distanceTo(playerPosition);
    this.label.visible = distance < 5;

    // 上下浮动动画
    this.mesh.position.y = this.baseY + Math.sin(Date.now() * 0.001) * 0.2;
  }

  showDetails() {
    // 显示 dapp 详情卡片
    window.dispatchEvent(new CustomEvent('showDappDetails', {
      detail: this.dapp
    }));
  }
}
```

#### 2. TreasureManager.js 增强
```javascript
// src/treasure/TreasureManager.js

export class TreasureManager {
  constructor(scene, mazeData, dappsData) {
    this.scene = scene;
    this.mazeData = mazeData;
    this.dappsData = dappsData;  // 新增：dapp 数据
    this.treasures = [];

    this.generateTreasures();
  }

  async loadDapps() {
    // 从 API 或本地加载 dapp 数据
    try {
      const response = await fetch('https://api.monad.xyz/v1/dapps');
      this.dappsData = await response.json();
    } catch (error) {
      // 降级到本地数据
      const response = await fetch('/data/dapps.json');
      this.dappsData = await response.json();
    }
  }

  generateTreasures() {
    // 根据 dapp 类别在迷宫中分区放置
    const categories = this.groupDappsByCategory();

    Object.entries(categories).forEach(([category, dapps]) => {
      const zone = this.getCategoryZone(category);

      dapps.forEach(dapp => {
        const position = this.findValidPosition(zone);
        const treasure = new Treasure(dapp, position);
        this.treasures.push(treasure);
        this.scene.add(treasure.mesh);
      });
    });
  }

  groupDappsByCategory() {
    return this.dappsData.reduce((acc, dapp) => {
      if (!acc[dapp.category]) {
        acc[dapp.category] = [];
      }
      acc[dapp.category].push(dapp);
      return acc;
    }, {});
  }

  getCategoryZone(category) {
    // 返回该类别对应的迷宫区域范围
    const zones = {
      'DeFi': { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
      'NFT': { xMin: 10, xMax: 20, yMin: 0, yMax: 10 },
      'Gaming': { xMin: 0, xMax: 10, yMin: 10, yMax: 20 },
      'DAO': { xMin: 10, xMax: 20, yMin: 10, yMax: 20 },
      'Infrastructure': { xMin: 0, xMax: 20, yMin: 20, yMax: 30 }
    };

    return zones[category] || zones['Infrastructure'];
  }
}
```

#### 3. MazeRenderer.js 增强
```javascript
// src/maze/MazeRenderer.js

export class MazeRenderer {
  constructor(scene, mazeData, categories) {
    this.scene = scene;
    this.mazeData = mazeData;
    this.categories = categories;  // 新增：类别信息

    this.createMaze();
    this.addCategoryZoneIndicators();  // 新增：区域指示器
  }

  addCategoryZoneIndicators() {
    // 在地面上显示不同颜色的区域标识
    Object.entries(this.categories).forEach(([category, config]) => {
      const zone = this.getCategoryZone(category);

      // 创建半透明的地面覆盖
      const geometry = new THREE.PlaneGeometry(
        zone.xMax - zone.xMin,
        zone.yMax - zone.yMin
      );

      const material = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });

      const zonePlane = new THREE.Mesh(geometry, material);
      zonePlane.rotation.x = -Math.PI / 2;
      zonePlane.position.set(
        (zone.xMin + zone.xMax) / 2,
        0.01,
        (zone.yMin + zone.yMax) / 2
      );

      this.scene.add(zonePlane);

      // 添加类别标签
      this.addZoneLabel(category, zonePlane.position, config.icon);
    });
  }

  addZoneLabel(category, position, icon) {
    // 创建 3D 文字标签
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'Bold 48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(`${icon} ${category}`, 256, 80);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 2, 1);
    sprite.position.copy(position);
    sprite.position.y = 0.1;

    this.scene.add(sprite);
  }
}
```

### 配置文件更新

#### public/config.json
```json
{
  "maze": {
    "width": 30,
    "height": 30,
    "zones": {
      "defi": { "xMin": 0, "xMax": 10, "yMin": 0, "yMax": 10 },
      "nft": { "xMin": 10, "xMax": 20, "yMin": 0, "yMax": 10 },
      "gaming": { "xMin": 0, "xMax": 10, "yMin": 10, "yMax": 20 },
      "dao": { "xMin": 10, "xMax": 20, "yMin": 10, "yMax": 20 },
      "infrastructure": { "xMin": 0, "xMax": 30, "yMin": 20, "yMax": 30 }
    }
  },

  "dapps": {
    "source": "https://api.monad.xyz/v1/dapps",
    "fallbackSource": "/data/dapps.json",
    "updateInterval": 300000,
    "categories": {
      "DeFi": {
        "color": "#FF0000",
        "icon": "💰",
        "description": "去中心化金融协议"
      },
      "NFT": {
        "color": "#00FF00",
        "icon": "🎨",
        "description": "NFT 市场和平台"
      },
      "Gaming": {
        "color": "#0000FF",
        "icon": "🎮",
        "description": "区块链游戏"
      },
      "DAO": {
        "color": "#FFFF00",
        "icon": "🏛️",
        "description": "去中心化自治组织"
      },
      "Infrastructure": {
        "color": "#FF00FF",
        "icon": "🔧",
        "description": "基础设施工具"
      }
    }
  },

  "recommendations": {
    "enabled": true,
    "algorithm": "hybrid",
    "weights": {
      "collaborative": 0.4,
      "content": 0.3,
      "trending": 0.2,
      "personalized": 0.1
    },
    "maxSuggestions": 10,
    "updateInterval": 60000
  },

  "web3": {
    "enabled": true,
    "network": {
      "chainId": "0x...",
      "chainName": "Monad",
      "rpcUrls": ["https://rpc.monad.xyz"],
      "blockExplorerUrls": ["https://explorer.monad.xyz"]
    },
    "features": {
      "walletConnect": true,
      "onChainAnalysis": true,
      "personalizedRecommendations": true
    }
  },

  "player": {
    "speed": 5,
    "viewRadius": 5,
    "interactionRadius": 2
  },

  "graphics": {
    "wallHeight": 2,
    "cellSize": 1,
    "treasureSize": {
      "min": 0.5,
      "max": 2.0
    },
    "particles": {
      "enabled": true,
      "count": {
        "normal": 50,
        "featured": 100
      }
    }
  },

  "ui": {
    "showMinimap": true,
    "showRecommendations": true,
    "showProgress": true,
    "theme": "monad"
  },

  "gamification": {
    "achievements": true,
    "leaderboard": true,
    "dailyChallenge": true,
    "socialSharing": true
  }
}
```

#### public/data/dapps.json (示例)
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
      "color": "#FF0000",
      "logo": "https://cdn.monad.xyz/logos/monadswap.png",
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
        "github": "https://github.com/monadswap"
      },
      "contracts": {
        "router": "0x1234...",
        "factory": "0x5678..."
      },
      "tags": ["AMM", "流动性挖矿", "治理代币"],
      "status": "live",
      "featured": true,
      "new": false,
      "verified": true
    },
    {
      "id": "monad-lend",
      "name": "Monad Lend",
      "category": "DeFi",
      "subcategory": "Lending",
      "description": "去中心化借贷协议",
      "longDescription": "Monad Lend 允许用户存入加密资产赚取利息，或以抵押品借入资产。采用动态利率模型，确保市场效率。",
      "url": "https://monadlend.xyz",
      "color": "#FF3333",
      "logo": "https://cdn.monad.xyz/logos/monadlend.png",
      "icon": "💰",
      "metrics": {
        "tvl": 8000000,
        "users": 3000,
        "volume24h": 200000,
        "transactions": 5000
      },
      "social": {
        "twitter": "https://twitter.com/monadlend",
        "discord": "https://discord.gg/monadlend"
      },
      "contracts": {
        "pool": "0xABCD..."
      },
      "tags": ["借贷", "抵押", "利息"],
      "status": "live",
      "featured": false,
      "new": false,
      "verified": true
    },
    {
      "id": "monad-art",
      "name": "Monad Art",
      "category": "NFT",
      "subcategory": "Marketplace",
      "description": "NFT 艺术品交易市场",
      "longDescription": "Monad Art 是一个专注于高质量数字艺术的 NFT 市场，支持艺术家创作、展示和销售作品。",
      "url": "https://monadart.xyz",
      "color": "#00FF00",
      "logo": "https://cdn.monad.xyz/logos/monadart.png",
      "icon": "🎨",
      "metrics": {
        "tvl": 5000000,
        "users": 10000,
        "volume24h": 100000,
        "transactions": 15000
      },
      "social": {
        "twitter": "https://twitter.com/monadart",
        "instagram": "https://instagram.com/monadart"
      },
      "tags": ["NFT", "艺术", "市场"],
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

---

## UI/UX 设计

### 界面布局

```
┌──────────────────────────────────────────────────────┐
│  [Logo] Monad Maze          [Connect Wallet] [Menu]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│              3D 迷宫游戏画布                          │
│                                                      │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Progress: 5/20 Dapps Discovered                    │
│  [DeFi: 2] [NFT: 1] [Gaming: 1] [DAO: 1]           │
└──────────────────────────────────────────────────────┘

侧边栏（可折叠）:
┌─────────────────┐
│ 🔍 Recommended  │
│ ───────────────│
│ • Monad Swap   │
│ • Monad Lend   │
│ • ...          │
│                │
│ ⭐ Favorites    │
│ ───────────────│
│ • (空)         │
│                │
│ 🗺️ Mini Map    │
│ ┌───────────┐ │
│ │ [地图]     │ │
│ └───────────┘ │
└─────────────────┘
```

### UI 组件设计

#### 1. 顶部导航栏
```html
<header class="game-header">
  <div class="logo">
    <img src="/assets/monad-logo.png" alt="Monad">
    <h1>Monad Maze Explorer</h1>
  </div>

  <div class="actions">
    <button id="wallet-btn" class="btn-primary">
      Connect Wallet
    </button>
    <button id="menu-btn" class="btn-icon">
      ☰
    </button>
  </div>
</header>
```

**样式**:
```css
.game-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-primary {
  background: #fff;
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: scale(1.05);
}
```

#### 2. Dapp 详情卡片
```html
<div class="dapp-card" id="dapp-card">
  <button class="close-btn">×</button>

  <div class="dapp-header">
    <img src="" alt="" class="dapp-logo">
    <div>
      <h2 class="dapp-name"></h2>
      <p class="dapp-category"></p>
    </div>
  </div>

  <p class="dapp-description"></p>

  <div class="dapp-metrics">
    <div class="metric">
      <span class="metric-label">TVL</span>
      <span class="metric-value" id="tvl"></span>
    </div>
    <div class="metric">
      <span class="metric-label">Users</span>
      <span class="metric-value" id="users"></span>
    </div>
    <div class="metric">
      <span class="metric-label">24h Volume</span>
      <span class="metric-value" id="volume"></span>
    </div>
  </div>

  <div class="dapp-tags" id="tags"></div>

  <div class="dapp-actions">
    <button class="btn-primary" id="visit-btn">
      Visit Dapp →
    </button>
    <button class="btn-secondary" id="favorite-btn">
      ⭐ Add to Favorites
    </button>
  </div>

  <div class="dapp-social" id="social"></div>
</div>
```

**样式**:
```css
.dapp-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.dapp-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dapp-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
}

.dapp-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.metric-value {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.dapp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background: #e0e7ff;
  color: #4c1d95;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
}

.dapp-actions {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.btn-secondary {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}
```

#### 3. 进度指示器
```html
<div class="progress-bar">
  <div class="progress-header">
    <span>Discovery Progress</span>
    <span id="progress-text">5/20</span>
  </div>

  <div class="progress-track">
    <div class="progress-fill" id="progress-fill"></div>
  </div>

  <div class="category-breakdown">
    <div class="category-chip" data-category="defi">
      💰 DeFi: <span>2</span>
    </div>
    <div class="category-chip" data-category="nft">
      🎨 NFT: <span>1</span>
    </div>
    <div class="category-chip" data-category="gaming">
      🎮 Gaming: <span>1</span>
    </div>
    <div class="category-chip" data-category="dao">
      🏛️ DAO: <span>1</span>
    </div>
  </div>
</div>
```

#### 4. 侧边栏
```html
<aside class="sidebar" id="sidebar">
  <button class="toggle-btn" id="sidebar-toggle">
    ◀
  </button>

  <div class="sidebar-content">
    <!-- 推荐区域 -->
    <section class="sidebar-section">
      <h3>🔍 Recommended for You</h3>
      <div id="recommendations-list"></div>
    </section>

    <!-- 收藏区域 -->
    <section class="sidebar-section">
      <h3>⭐ Favorites</h3>
      <div id="favorites-list"></div>
    </section>

    <!-- 小地图 -->
    <section class="sidebar-section">
      <h3>🗺️ Mini Map</h3>
      <canvas id="minimap" width="200" height="200"></canvas>
    </section>

    <!-- 筛选器 -->
    <section class="sidebar-section">
      <h3>🎯 Filter</h3>
      <div class="filter-group">
        <label>
          <input type="checkbox" name="category" value="defi" checked>
          💰 DeFi
        </label>
        <label>
          <input type="checkbox" name="category" value="nft" checked>
          🎨 NFT
        </label>
        <label>
          <input type="checkbox" name="category" value="gaming" checked>
          🎮 Gaming
        </label>
        <label>
          <input type="checkbox" name="category" value="dao" checked>
          🏛️ DAO
        </label>
        <label>
          <input type="checkbox" name="category" value="infrastructure" checked>
          🔧 Infrastructure
        </label>
      </div>
    </section>
  </div>
</aside>
```

#### 5. 小地图实现
```javascript
// src/ui/MiniMap.js

export class MiniMap {
  constructor(canvasId, mazeData, player, treasures) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.mazeData = mazeData;
    this.player = player;
    this.treasures = treasures;

    this.scale = this.canvas.width / mazeData.width;
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制迷宫
    this.drawMaze();

    // 绘制宝藏
    this.drawTreasures();

    // 绘制玩家
    this.drawPlayer();

    // 绘制迷雾
    this.drawFog();
  }

  drawMaze() {
    for (let y = 0; y < this.mazeData.height; y++) {
      for (let x = 0; x < this.mazeData.width; x++) {
        const cell = this.mazeData.cells[y][x];

        if (cell === 0) {
          // 墙壁
          this.ctx.fillStyle = '#333';
        } else {
          // 路径
          this.ctx.fillStyle = '#ddd';
        }

        this.ctx.fillRect(
          x * this.scale,
          y * this.scale,
          this.scale,
          this.scale
        );
      }
    }
  }

  drawTreasures() {
    this.treasures.forEach(treasure => {
      if (!treasure.collected) {
        this.ctx.fillStyle = treasure.dapp.color;
        this.ctx.beginPath();
        this.ctx.arc(
          treasure.position.x * this.scale,
          treasure.position.z * this.scale,
          this.scale * 0.3,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
    });
  }

  drawPlayer() {
    this.ctx.fillStyle = '#00ff00';
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.position.x * this.scale,
      this.player.position.z * this.scale,
      this.scale * 0.5,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // 绘制视野范围
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.position.x * this.scale,
      this.player.position.z * this.scale,
      this.player.viewRadius * this.scale,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
  }

  drawFog() {
    // 半透明黑色覆盖未探索区域
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

    // 创建遮罩（简化版，实际应该根据探索历史）
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 清除玩家视野范围
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(
      this.player.position.x * this.scale,
      this.player.position.z * this.scale,
      this.player.viewRadius * this.scale,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    this.ctx.globalCompositeOperation = 'source-over';
  }
}
```

---

## 游戏化元素

### 1. 成就系统

#### 成就定义
```javascript
// src/gamification/Achievements.js

export const ACHIEVEMENTS = [
  {
    id: 'first-discovery',
    name: '初次发现',
    description: '发现你的第一个 Dapp',
    icon: '🎯',
    condition: (stats) => stats.discovered >= 1,
    reward: { xp: 10 }
  },
  {
    id: 'defi-explorer',
    name: 'DeFi 探险家',
    description: '发现所有 DeFi 类 Dapps',
    icon: '💰',
    condition: (stats) => stats.categoriesComplete.includes('DeFi'),
    reward: { xp: 100, badge: 'defi-master' }
  },
  {
    id: 'speed-runner',
    name: '速度狂人',
    description: '在 5 分钟内发现 10 个 Dapps',
    icon: '⚡',
    condition: (stats) => {
      return stats.discovered >= 10 && stats.time <= 300;
    },
    reward: { xp: 200, title: 'Speed Explorer' }
  },
  {
    id: 'completionist',
    name: '完美主义者',
    description: '发现所有 Dapps',
    icon: '👑',
    condition: (stats) => stats.discovered === stats.total,
    reward: { xp: 500, badge: 'completionist', title: 'Master Explorer' }
  },
  {
    id: 'early-bird',
    name: '早起的鸟儿',
    description: '发现一个上线不到 7 天的新 Dapp',
    icon: '🐦',
    condition: (stats) => stats.newDappsFound > 0,
    reward: { xp: 50 }
  },
  {
    id: 'social-butterfly',
    name: '社交达人',
    description: '分享 5 个 Dapps 到社交媒体',
    icon: '🦋',
    condition: (stats) => stats.shared >= 5,
    reward: { xp: 100 }
  },
  {
    id: 'whale-watcher',
    name: '鲸鱼观察者',
    description: '发现一个 TVL 超过 $100M 的 Dapp',
    icon: '🐋',
    condition: (stats) => stats.maxTVLFound >= 100000000,
    reward: { xp: 150 }
  }
];

export class AchievementManager {
  constructor() {
    this.unlockedAchievements = [];
    this.stats = {
      discovered: 0,
      total: 0,
      categoriesComplete: [],
      time: 0,
      newDappsFound: 0,
      shared: 0,
      maxTVLFound: 0
    };
  }

  checkAchievements() {
    ACHIEVEMENTS.forEach(achievement => {
      if (!this.isUnlocked(achievement.id) && achievement.condition(this.stats)) {
        this.unlockAchievement(achievement);
      }
    });
  }

  unlockAchievement(achievement) {
    this.unlockedAchievements.push(achievement.id);

    // 显示解锁动画
    this.showUnlockNotification(achievement);

    // 保存到本地存储
    this.save();

    // 触发事件
    window.dispatchEvent(new CustomEvent('achievementUnlocked', {
      detail: achievement
    }));
  }

  showUnlockNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-content">
        <h4>成就解锁！</h4>
        <p>${achievement.name}</p>
        <small>${achievement.description}</small>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  isUnlocked(achievementId) {
    return this.unlockedAchievements.includes(achievementId);
  }

  getProgress() {
    return {
      total: ACHIEVEMENTS.length,
      unlocked: this.unlockedAchievements.length,
      percentage: (this.unlockedAchievements.length / ACHIEVEMENTS.length) * 100
    };
  }
}
```

#### 成就通知样式
```css
.achievement-notification {
  position: fixed;
  top: 100px;
  right: -400px;
  width: 350px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: right 0.3s ease-out;
  z-index: 10000;
}

.achievement-notification.show {
  right: 20px;
}

.achievement-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.achievement-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.achievement-content p {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.achievement-content small {
  opacity: 0.9;
  font-size: 0.9rem;
}
```

### 2. 排行榜系统

#### 数据结构
```javascript
// src/gamification/Leaderboard.js

export class Leaderboard {
  constructor() {
    this.categories = [
      'speed',         // 最快完成时间
      'discoveries',   // 发现数量
      'completeness'   // 完成度
    ];

    this.apiEndpoint = 'https://api.monad-maze.xyz/leaderboard';
  }

  async submitScore(playerData) {
    const score = {
      address: playerData.walletAddress,
      name: playerData.name || this.shortenAddress(playerData.walletAddress),

      // 统计数据
      discovered: playerData.discovered,
      completionRate: (playerData.discovered / playerData.total) * 100,
      time: playerData.time,

      // 额外信息
      achievements: playerData.achievements.length,
      timestamp: Date.now()
    };

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(score)
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  }

  async getTopPlayers(category = 'completeness', limit = 10) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}?category=${category}&limit=${limit}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  async getPlayerRank(address) {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/rank/${address}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch player rank:', error);
      return null;
    }
  }

  shortenAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
```

#### 排行榜 UI
```html
<div class="leaderboard-modal" id="leaderboard-modal">
  <div class="modal-content">
    <button class="close-btn">×</button>

    <h2>🏆 Leaderboard</h2>

    <div class="leaderboard-tabs">
      <button class="tab active" data-category="completeness">
        Completion Rate
      </button>
      <button class="tab" data-category="speed">
        Fastest Time
      </button>
      <button class="tab" data-category="discoveries">
        Most Discoveries
      </button>
    </div>

    <div class="leaderboard-list" id="leaderboard-list">
      <!-- 动态生成 -->
    </div>

    <div class="player-rank" id="player-rank">
      Your Rank: #42
    </div>
  </div>
</div>
```

```javascript
// 排行榜渲染
function renderLeaderboard(players) {
  const list = document.getElementById('leaderboard-list');

  list.innerHTML = players.map((player, index) => `
    <div class="leaderboard-entry ${index < 3 ? 'top-3' : ''}">
      <span class="rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}">
        ${index + 1}
      </span>
      <span class="player-name">${player.name}</span>
      <span class="player-score">${player.score}</span>
    </div>
  `).join('');
}
```

```css
.leaderboard-entry {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: #f5f5f5;
  border-radius: 8px;
  transition: transform 0.2s;
}

.leaderboard-entry:hover {
  transform: translateX(5px);
}

.leaderboard-entry.top-3 {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ddd;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 1rem;
}

.rank.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: white;
}

.rank.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
  color: white;
}

.rank.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  color: white;
}

.player-name {
  flex: 1;
  font-weight: 500;
}

.player-score {
  font-weight: bold;
  font-size: 1.1rem;
}
```

### 3. 每日挑战

```javascript
// src/gamification/DailyChallenge.js

export class DailyChallenge {
  constructor() {
    this.challenges = [
      {
        id: 'defi-focus',
        name: 'DeFi 专注日',
        description: '发现 5 个 DeFi Dapps',
        target: { category: 'DeFi', count: 5 },
        reward: { xp: 200, badge: 'daily-defi' }
      },
      {
        id: 'speed-run',
        name: '速度挑战',
        description: '在 10 分钟内发现 8 个 Dapps',
        target: { count: 8, time: 600 },
        reward: { xp: 300, badge: 'daily-speed' }
      },
      {
        id: 'explorer',
        name: '全面探索',
        description: '每个类别至少发现 1 个 Dapp',
        target: { allCategories: true },
        reward: { xp: 250, badge: 'daily-explorer' }
      }
    ];
  }

  getTodayChallenge() {
    // 基于日期生成每日挑战
    const dayOfYear = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );

    const challengeIndex = dayOfYear % this.challenges.length;
    return this.challenges[challengeIndex];
  }

  checkCompletion(stats, challenge) {
    if (challenge.target.category) {
      return stats.categories[challenge.target.category] >= challenge.target.count;
    }

    if (challenge.target.time) {
      return stats.discovered >= challenge.target.count &&
             stats.time <= challenge.target.time;
    }

    if (challenge.target.allCategories) {
      return Object.values(stats.categories).every(count => count > 0);
    }

    return false;
  }
}
```

---

## 社交功能

### 1. 分享功能

```javascript
// src/social/ShareManager.js

export class ShareManager {
  constructor() {
    this.baseUrl = 'https://monad-maze.xyz';
  }

  shareDiscovery(dapp) {
    const text = `我在 Monad Maze 中发现了 ${dapp.name}！🎯\n\n${dapp.description}\n\n一起来探索 Monad 生态吧！`;
    const url = `${this.baseUrl}/dapp/${dapp.id}`;
    const hashtags = 'Monad,Web3,DeFi';

    return this.shareToTwitter(text, url, hashtags);
  }

  shareProgress(stats) {
    const text = `我在 Monad Maze 中探索了 ${stats.discovered}/${stats.total} 个 Dapps！\n\n完成度：${stats.completionRate.toFixed(1)}%\n用时：${this.formatTime(stats.time)}\n\n你能超越我吗？🏆`;
    const url = this.baseUrl;
    const hashtags = 'MonadMaze,GameFi';

    return this.shareToTwitter(text, url, hashtags);
  }

  shareAchievement(achievement) {
    const text = `🎉 解锁成就：${achievement.name}\n\n${achievement.description}\n\n#MonadMaze #Achievement`;
    const url = this.baseUrl;

    return this.shareToTwitter(text, url);
  }

  shareToTwitter(text, url, hashtags = '') {
    const twitterUrl = new URL('https://twitter.com/intent/tweet');
    twitterUrl.searchParams.set('text', text);
    twitterUrl.searchParams.set('url', url);

    if (hashtags) {
      twitterUrl.searchParams.set('hashtags', hashtags);
    }

    window.open(twitterUrl.toString(), '_blank', 'width=600,height=400');
  }

  generateShareImage(stats) {
    // 生成分享用的图片
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加文字
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Monad Maze Explorer', canvas.width / 2, 150);

    ctx.font = 'bold 96px Arial';
    ctx.fillText(`${stats.discovered}/${stats.total}`, canvas.width / 2, 300);

    ctx.font = '48px Arial';
    ctx.fillText('Dapps Discovered', canvas.width / 2, 380);

    ctx.font = '36px Arial';
    ctx.fillText(`${stats.completionRate.toFixed(1)}% Complete`, canvas.width / 2, 480);

    return canvas.toDataURL('image/png');
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
```

### 2. 截图功能

```javascript
// src/social/Screenshot.js

export class ScreenshotManager {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  async capture() {
    // 渲染当前场景
    this.renderer.render(this.scene, this.camera);

    // 获取 canvas 数据
    const canvas = this.renderer.domElement;
    const dataURL = canvas.toDataURL('image/png');

    return dataURL;
  }

  async download() {
    const dataURL = await this.capture();

    const link = document.createElement('a');
    link.download = `monad-maze-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }

  async share() {
    const dataURL = await this.capture();

    // 转换为 Blob
    const blob = await (await fetch(dataURL)).blob();

    // 使用 Web Share API
    if (navigator.share) {
      try {
        const file = new File([blob], 'monad-maze.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My Monad Maze Progress',
          text: 'Check out my progress in Monad Maze!'
        });
      } catch (error) {
        console.error('Share failed:', error);
        // 降级到下载
        this.download();
      }
    } else {
      // 浏览器不支持 Web Share API，直接下载
      this.download();
    }
  }
}
```

---

## Mission 9 要求检查

### 必需条件

| 要求 | 状态 | 实现方案 |
|------|------|----------|
| 开源 | ✅ | MIT License，GitHub 公开仓库 |
| 所有人可访问 | ✅ | Web 应用，部署到公共域名 |
| 与 Monad 主网协议配合 | ✅ | 钱包连接、链上数据读取、合约交互 |
| 提供功能性 app 发现 | ✅ | 真实 Dapp 列表、详情展示、分类浏览 |
| 团队构建 (2-4人) | ✅ | 需组建团队 |
| 清晰文档 | ✅ | README、技术文档、API 文档 |

### 加分项

| 加分项 | 状态 | 实现方案 |
|--------|------|----------|
| 3D/沉浸式技术 | ✅ | Three.js 3D 渲染 |
| 新颖展示方式 | ✅ | 迷宫探索游戏化体验 |
| 智能推荐 | ✅ | 混合推荐算法（协同过滤 + 内容推荐 + 热度） |
| 游戏化元素 | ✅ | 成就系统、排行榜、每日挑战 |
| 优秀 UX 设计 | ✅ | 流畅操作、美观界面、响应式设计 |
| 创意使用 Monad 品牌 | ✅ | Monad 配色、Logo、区域命名 |

### 额外亮点

- **迷雾战争机制**: 增加探索趣味性
- **链上数据集成**: 个性化用户体验
- **社交分享**: 病毒式传播
- **实时数据同步**: 保持 Dapp 信息最新
- **多语言支持**: 扩大用户群体（可选）
- **移动端适配**: 触摸控制优化（可选）

---

## 开发路线图

### Phase 1-8: 基础迷宫游戏（已规划）
参考 TECH_DESIGN.md

### Phase 9: Monad 集成（新增，约 5 天）

#### Day 1: Dapp 数据层
- [ ] 创建 Dapp 数据模型
- [ ] 实现 API 客户端
- [ ] 从 Monad 生态获取 Dapp 列表
- [ ] 创建本地数据库（备用）
- [ ] 实现数据同步机制

**文件清单**:
- `src/dapp/DappManager.js`
- `src/utils/APIClient.js`
- `public/data/dapps.json`

#### Day 2: UI 组件开发
- [ ] 实现 Dapp 详情卡片
- [ ] 创建侧边栏（推荐、收藏、筛选）
- [ ] 实现小地图
- [ ] 添加进度指示器
- [ ] 优化布局和样式

**文件清单**:
- `src/dapp/DappCard.js`
- `src/ui/Sidebar.js`
- `src/ui/MiniMap.js`
- `src/ui/ProgressBar.js`
- `styles/components.css`

#### Day 3: Web3 集成
- [ ] 实现钱包连接
- [ ] 配置 Monad 网络
- [ ] 链上数据读取
- [ ] 用户历史分析
- [ ] 个性化体验

**文件清单**:
- `src/web3/WalletConnector.js`
- `src/web3/OnChainAnalyzer.js`
- `src/web3/NetworkConfig.js`

#### Day 4: 推荐系统
- [ ] 实现协同过滤算法
- [ ] 实现内容推荐算法
- [ ] 实现热度推荐
- [ ] 组合推荐策略
- [ ] 用户行为追踪

**文件清单**:
- `src/dapp/DappRecommender.js`
- `src/analytics/UserBehavior.js`
- `src/analytics/RecommendationEngine.js`

#### Day 5: 游戏化和社交
- [ ] 实现成就系统
- [ ] 创建排行榜
- [ ] 实现每日挑战
- [ ] 添加分享功能
- [ ] 截图功能

**文件清单**:
- `src/gamification/Achievements.js`
- `src/gamification/Leaderboard.js`
- `src/gamification/DailyChallenge.js`
- `src/social/ShareManager.js`
- `src/social/Screenshot.js`

### Phase 10: 测试和优化（约 3 天）

#### Day 1: 功能测试
- [ ] 测试所有 Dapp 交互功能
- [ ] 测试钱包连接和网络切换
- [ ] 测试推荐算法准确性
- [ ] 测试成就解锁逻辑
- [ ] 测试分享功能

#### Day 2: 性能优化
- [ ] 优化 3D 渲染性能
- [ ] 优化数据加载和缓存
- [ ] 减少 API 调用次数
- [ ] 优化资源加载
- [ ] 测试不同设备性能

#### Day 3: UX 优化
- [ ] 优化加载体验
- [ ] 添加加载动画
- [ ] 优化错误处理
- [ ] 改进提示信息
- [ ] 多端适配测试

### Phase 11: 文档和部署（约 2 天）

#### Day 1: 文档编写
- [ ] 完善 README
- [ ] 编写用户指南
- [ ] 编写开发者文档
- [ ] 创建 API 文档
- [ ] 录制演示视频

#### Day 2: 部署和发布
- [ ] 部署到生产环境
- [ ] 配置 CDN
- [ ] SEO 优化
- [ ] 准备 Twitter 宣传内容
- [ ] 提交到 Mission 9

**总计**: 约 18 天（8 + 5 + 3 + 2）

---

## 数据结构设计

### 本地存储结构

```javascript
// localStorage keys

// 用户进度
'monadMaze.progress' = {
  discovered: ['dapp-id-1', 'dapp-id-2', ...],
  favorites: ['dapp-id-3', ...],
  visited: ['dapp-id-1', 'dapp-id-2', ...],
  exploredCells: [[x1, y1], [x2, y2], ...],
  startTime: timestamp,
  totalTime: seconds
}

// 用户成就
'monadMaze.achievements' = {
  unlocked: ['achievement-id-1', ...],
  progress: {
    'achievement-id-2': 0.5  // 50% 完成
  }
}

// 用户设置
'monadMaze.settings' = {
  showMinimap: true,
  showRecommendations: true,
  musicVolume: 0.5,
  sfxVolume: 0.7,
  graphicsQuality: 'high'
}

// 钱包信息
'monadMaze.wallet' = {
  address: '0x...',
  chainId: '0x...',
  connected: true
}
```

### API 端点设计

```javascript
// Dapp 数据 API

// 获取所有 Dapps
GET /api/v1/dapps
Response: {
  dapps: [...],
  lastUpdated: timestamp,
  total: number
}

// 获取单个 Dapp
GET /api/v1/dapps/:id
Response: { dapp object }

// 获取分类 Dapps
GET /api/v1/dapps/category/:category
Response: { dapps: [...] }

// 获取推荐
GET /api/v1/recommendations/:address
Response: {
  recommendations: [...],
  algorithm: 'hybrid',
  confidence: 0.85
}

// 更新 Dapp 指标
GET /api/v1/dapps/metrics
Response: {
  dapps: [
    { id, tvl, users, volume24h, ... }
  ]
}
```

```javascript
// 排行榜 API

// 提交分数
POST /api/v1/leaderboard
Body: {
  address: '0x...',
  name: 'Player',
  discovered: 20,
  completionRate: 100,
  time: 600,
  achievements: 5
}

// 获取排行榜
GET /api/v1/leaderboard?category=completeness&limit=10
Response: {
  leaderboard: [
    { rank: 1, address, name, score, ... }
  ]
}

// 获取玩家排名
GET /api/v1/leaderboard/rank/:address
Response: {
  rank: 42,
  score: { ... },
  percentile: 75
}
```

---

## 技术栈总结

### 前端
- **Three.js** (r160+): 3D 渲染
- **Vite**: 构建工具
- **JavaScript/ES6+**: 编程语言
- **CSS3**: 样式和动画
- **HTML5 Canvas**: 小地图和截图

### Web3
- **ethers.js**: 以太坊交互库
- **WalletConnect**: 钱包连接
- **Monad RPC**: 链上数据

### 后端（可选，用于排行榜）
- **Node.js + Express**: API 服务器
- **MongoDB/PostgreSQL**: 数据库
- **Redis**: 缓存

### 部署
- **Vercel/Netlify**: 静态网站托管
- **Cloudflare CDN**: 内容分发
- **GitHub Actions**: CI/CD

---

## 风险和缓解措施

### 1. Dapp 数据可用性
**风险**: Monad 官方 API 可能不可用或数据不完整

**缓解**:
- 创建本地 Dapp 数据库作为备用
- 允许社区贡献新 Dapp
- 定期手动更新数据

### 2. 性能问题
**风险**: 大型迷宫可能导致性能下降

**缓解**:
- 实现 LOD (Level of Detail) 系统
- 使用对象池复用 3D 对象
- 限制渲染范围（只渲染视野内的对象）
- 提供图形质量选项

### 3. 钱包兼容性
**风险**: 某些钱包可能不支持 Monad 网络

**缓解**:
- 提供详细的网络添加指南
- 自动检测和切换网络
- 降级到无钱包模式（功能受限）

### 4. 用户体验学习曲线
**风险**: 新用户可能不理解如何操作

**缓解**:
- 添加新手引导教程
- 提供操作提示
- 创建演示视频
- 简化初始关卡

---

## 成功指标

### 用户参与度
- **目标**: 日活用户 > 1000
- **指标**: 平均游戏时长 > 10 分钟
- **指标**: 用户留存率 > 30% (7天)

### Dapp 发现
- **目标**: 每用户平均发现 > 15 个 Dapps
- **指标**: 外部链接点击率 > 20%
- **指标**: 钱包连接率 > 40%

### 社交传播
- **目标**: 分享次数 > 500
- **指标**: Twitter 提及 > 100
- **指标**: 病毒系数 > 1.2

### 技术性能
- **目标**: 页面加载时间 < 3 秒
- **指标**: 平均帧率 > 50 FPS
- **指标**: 错误率 < 1%

---

## 后续扩展计划

### V2 功能
1. **多人协作模式**
   - 实时多人同时探索
   - 团队挑战
   - 好友系统

2. **高级游戏化**
   - NFT 奖励
   - 代币激励
   - 赛季排名

3. **深度集成**
   - 直接在游戏内与 Dapp 交互
   - 钱包余额显示
   - 交易历史可视化

4. **AI 助手**
   - 智能导航建议
   - 个性化 Dapp 推荐
   - 自然语言搜索

---

**文档版本**: 1.0
**最后更新**: 2025-11-08

*此文档为 Monad Maze Explorer 项目的核心设计文档，将随项目进展持续更新。*
