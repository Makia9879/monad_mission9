import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { MazeGenerator } from '../maze/MazeGenerator.js';
import { MazeRenderer } from '../maze/MazeRenderer.js';
import { Player } from '../player/Player.js';
import { PlayerController } from '../player/PlayerController.js';
import { TreasureManager } from '../treasure/TreasureManager.js';
import { FogOfWar } from '../fog/FogOfWar.js';
import { GameUI } from '../ui/GameUI.js';

/**
 * 游戏主类
 */
export class Game {
  constructor(config) {
    this.config = config;
    this.container = document.getElementById('game-container');

    // 核心系统
    this.sceneManager = null;
    this.inputManager = null;

    // 游戏对象
    this.mazeGenerator = null;
    this.mazeRenderer = null;
    this.player = null;
    this.playerController = null;
    this.treasureManager = null;
    this.fogOfWar = null;
    this.ui = null;

    // 游戏状态
    this.isRunning = false;
    this.isVictory = false;

    this.init();
  }

  /**
   * 初始化游戏
   */
  init() {
    console.log('Initializing game...');

    // 初始化核心系统
    this.sceneManager = new SceneManager(this.container);
    this.inputManager = new InputManager(this.container);

    // 初始化UI
    this.ui = new GameUI();
    this.ui.onRestart(() => this.restart());

    // 开始游戏
    this.startNewGame();

    // 启动游戏循环
    this.isRunning = true;
    this.gameLoop();
  }

  /**
   * 开始新游戏
   */
  startNewGame() {
    console.log('Starting new game...');

    // 清理旧游戏对象
    this.cleanup();

    // 重置状态
    this.isVictory = false;

    // 生成迷宫
    this.mazeGenerator = new MazeGenerator(
      this.config.maze.width,
      this.config.maze.height
    );
    this.mazeGenerator.generate();

    // 渲染迷宫
    this.mazeRenderer = new MazeRenderer(
      this.sceneManager.getScene(),
      this.mazeGenerator,
      this.config
    );
    this.mazeRenderer.render();

    // 创建玩家
    const startCell = this.mazeGenerator.getRandomWalkableCell();
    const startPos = this.mazeRenderer.gridToWorld(startCell.x, startCell.y);

    this.player = new Player(
      this.sceneManager.getScene(),
      startPos.x,
      startPos.z,
      this.config
    );

    // 创建玩家控制器
    this.playerController = new PlayerController(
      this.player,
      this.inputManager,
      this.mazeGenerator,
      this.config
    );

    // 生成宝物
    this.treasureManager = new TreasureManager(
      this.sceneManager.getScene(),
      this.mazeGenerator,
      this.config
    );
    this.treasureManager.generate();

    // 创建迷雾
    this.fogOfWar = new FogOfWar(
      this.sceneManager.getScene(),
      this.mazeGenerator,
      this.config
    );

    // 更新UI
    const progress = this.treasureManager.getProgress();
    this.ui.updateTreasureCount(progress.collected, progress.total);

    console.log('Game started!');
  }

  /**
   * 游戏循环
   */
  gameLoop() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.gameLoop());

    const deltaTime = this.sceneManager.getClock().getDelta();

    this.update(deltaTime);
    this.render();
  }

  /**
   * 更新游戏逻辑
   */
  update(deltaTime) {
    if (this.isVictory) return;

    // 更新玩家控制
    this.playerController.update(deltaTime);

    // 更新玩家
    this.player.update(deltaTime);

    // 更新宝物
    this.treasureManager.update(deltaTime);

    // 检查宝物碰撞
    const playerPos = this.player.getPosition();
    if (this.treasureManager.checkCollision(playerPos)) {
      // 更新UI
      const progress = this.treasureManager.getProgress();
      this.ui.updateTreasureCount(progress.collected, progress.total);

      // 检查是否胜利
      if (this.treasureManager.isAllCollected()) {
        this.onVictory();
      }
    }

    // 更新迷雾
    if (this.fogOfWar) {
      this.fogOfWar.update(playerPos.x, playerPos.z);
    }

    // 更新相机
    this.sceneManager.updateCamera(
      playerPos.x,
      playerPos.z,
      this.config.maze.width,
      this.config.maze.height,
      this.config.graphics.cellSize
    );
  }

  /**
   * 渲染
   */
  render() {
    this.sceneManager.render();
  }

  /**
   * 胜利处理
   */
  onVictory() {
    console.log('Victory!');
    this.isVictory = true;
    this.ui.showVictory();
  }

  /**
   * 重新开始
   */
  restart() {
    console.log('Restarting game...');
    this.startNewGame();
  }

  /**
   * 清理游戏对象
   */
  cleanup() {
    if (this.mazeRenderer) {
      this.mazeRenderer.clear();
      this.mazeRenderer = null;
    }

    if (this.player) {
      this.player.dispose();
      this.player = null;
    }

    if (this.treasureManager) {
      this.treasureManager.clear();
      this.treasureManager = null;
    }

    if (this.fogOfWar) {
      this.fogOfWar.dispose();
      this.fogOfWar = null;
    }

    this.mazeGenerator = null;
    this.playerController = null;
  }

  /**
   * 销毁游戏
   */
  dispose() {
    this.isRunning = false;

    this.cleanup();

    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }

    if (this.inputManager) {
      this.inputManager.dispose();
      this.inputManager = null;
    }
  }
}
