/**
 * 游戏UI管理器
 */
export class GameUI {
  constructor() {
    this.collectedElement = document.getElementById('collected');
    this.totalElement = document.getElementById('total');
    this.victoryScreen = document.getElementById('victory-screen');
    this.restartButton = document.getElementById('restart-button');

    this.onRestartCallback = null;

    this.init();
  }

  /**
   * 初始化UI
   */
  init() {
    // 绑定重新开始按钮
    this.restartButton.addEventListener('click', () => {
      this.hideVictory();
      if (this.onRestartCallback) {
        this.onRestartCallback();
      }
    });
  }

  /**
   * 更新宝物计数
   */
  updateTreasureCount(collected, total) {
    this.collectedElement.textContent = collected;
    this.totalElement.textContent = total;
  }

  /**
   * 显示胜利界面
   */
  showVictory() {
    this.victoryScreen.style.display = 'block';
  }

  /**
   * 隐藏胜利界面
   */
  hideVictory() {
    this.victoryScreen.style.display = 'none';
  }

  /**
   * 设置重新开始回调
   */
  onRestart(callback) {
    this.onRestartCallback = callback;
  }
}
