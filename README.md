# 3D迷宫寻宝游戏

一个基于Three.js的3D迷宫寻宝游戏，上帝视角操作角色在随机生成的迷宫中寻找宝物。

## 功能特性

- 随机生成的迷宫地图（递归回溯算法）
- 3D渲染场景（Three.js）
- 上帝视角相机跟随
- 战争迷雾效果（只能看到角色周围区域）
- 多种颜色的宝石
- 平滑的移动控制（WASD + 鼠标拖拽）
- 碰撞检测
- 胜利界面和重新开始功能

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

游戏将在浏览器中自动打开，地址为：http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建后的文件将在 `dist` 目录中。

### 预览生产版本

```bash
npm run preview
```

## 游戏控制

- **WASD 键** - 移动角色
- **鼠标左键拖拽** - 移动角色
- **目标** - 收集所有宝物

## 配置文件

游戏配置文件位于 `public/config.json`，可以调整以下参数：

```json
{
  "maze": {
    "width": 20,        // 迷宫宽度
    "height": 20        // 迷宫高度
  },
  "treasures": {
    "count": 5,         // 宝物数量
    "types": [          // 宝物类型和颜色
      {
        "name": "ruby",
        "color": "#FF0000"
      }
    ]
  },
  "player": {
    "speed": 5,         // 玩家移动速度
    "viewRadius": 5     // 视野半径
  },
  "graphics": {
    "wallHeight": 2,    // 墙壁高度
    "cellSize": 1       // 单元格大小
  }
}
```

## 项目结构

```
.
├── src/
│   ├── main.js              # 入口文件
│   ├── config/
│   │   └── gameConfig.js    # 配置加载器
│   ├── core/
│   │   ├── Game.js          # 游戏主类
│   │   ├── SceneManager.js  # 场景管理器
│   │   └── InputManager.js  # 输入管理器
│   ├── maze/
│   │   ├── MazeGenerator.js # 迷宫生成算法
│   │   └── MazeRenderer.js  # 迷宫渲染器
│   ├── player/
│   │   ├── Player.js        # 玩家类
│   │   └── PlayerController.js # 玩家控制器
│   ├── treasure/
│   │   ├── Treasure.js      # 宝物类
│   │   └── TreasureManager.js # 宝物管理器
│   ├── fog/
│   │   └── FogOfWar.js      # 战争迷雾
│   └── ui/
│       └── GameUI.js        # UI管理器
├── public/
│   └── config.json          # 游戏配置文件
├── index.html               # HTML入口
├── package.json
└── vite.config.js           # Vite配置
```

## 技术栈

- **Three.js** - 3D渲染引擎
- **Vite** - 构建工具
- **JavaScript (ES6+)** - 编程语言

## 开发文档

详细的技术设计文档请参考 [TECH_DESIGN.md](./TECH_DESIGN.md)

## 许可证

MIT
