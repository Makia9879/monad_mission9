/**
 * 玩家控制器
 */
export class PlayerController {
  constructor(player, inputManager, mazeGenerator, config) {
    this.player = player;
    this.inputManager = inputManager;
    this.mazeGenerator = mazeGenerator;
    this.config = config;
  }

  /**
   * 更新玩家控制
   */
  update(deltaTime) {
    // 获取输入方向
    const direction = this.inputManager.getInputDirection();

    if (direction.x === 0 && direction.y === 0) {
      return; // 没有输入
    }

    // 计算移动速度
    const speed = this.config.player.speed * deltaTime;

    // 获取当前位置
    const currentPos = this.player.getPosition();

    // 计算目标位置
    let targetX = currentPos.x + direction.x * speed;
    let targetZ = currentPos.z + direction.y * speed;

    // 碰撞检测
    const validPos = this.checkCollision(targetX, targetZ);

    // 设置目标位置
    this.player.setTargetPosition(validPos.x, validPos.z);
  }

  /**
   * 碰撞检测
   * @param {number} targetX - 目标X坐标
   * @param {number} targetZ - 目标Z坐标
   * @returns {Object} 修正后的坐标 {x, z}
   */
  checkCollision(targetX, targetZ) {
    const cellSize = this.config.graphics.cellSize;
    const playerRadius = 0.3; // 玩家半径

    // 转换为网格坐标
    const gridX = Math.floor(targetX / cellSize);
    const gridY = Math.floor(targetZ / cellSize);

    // 检查目标位置是否可行走
    if (!this.mazeGenerator.isWalkable(gridX, gridY)) {
      // 尝试只在X轴移动
      const currentPos = this.player.getPosition();
      const gridXOnly = Math.floor(targetX / cellSize);
      const gridYOnly = Math.floor(currentPos.z / cellSize);

      if (this.mazeGenerator.isWalkable(gridXOnly, gridYOnly)) {
        return { x: targetX, z: currentPos.z };
      }

      // 尝试只在Z轴移动
      const gridXOnlyZ = Math.floor(currentPos.x / cellSize);
      const gridYOnlyZ = Math.floor(targetZ / cellSize);

      if (this.mazeGenerator.isWalkable(gridXOnlyZ, gridYOnlyZ)) {
        return { x: currentPos.x, z: targetZ };
      }

      // 两个方向都不能移动，返回当前位置
      return { x: currentPos.x, z: currentPos.z };
    }

    // 可以移动到目标位置
    return { x: targetX, z: targetZ };
  }

  /**
   * 检查某个网格位置是否可行走
   */
  isWalkable(gridX, gridY) {
    return this.mazeGenerator.isWalkable(gridX, gridY);
  }
}
