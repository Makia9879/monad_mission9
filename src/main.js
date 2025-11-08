import { GameConfig } from './config/gameConfig.js';
import { Game } from './core/Game.js';

/**
 * 游戏入口
 */
async function main() {
  console.log('Loading game...');

  // 加载配置
  const gameConfig = new GameConfig();
  const config = await gameConfig.load();

  console.log('Config loaded:', config);

  // 创建游戏
  const game = new Game(config);

  // 保存到window以便调试
  window.game = game;

  console.log('Game initialized!');
}

// 启动游戏
main().catch(error => {
  console.error('Failed to start game:', error);
});
