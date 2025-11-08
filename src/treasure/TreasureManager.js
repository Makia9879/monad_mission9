import { Treasure } from './Treasure.js';

/**
 * 宝物管理器
 */
export class TreasureManager {
  constructor(scene, mazeGenerator, config) {
    this.scene = scene;
    this.mazeGenerator = mazeGenerator;
    this.config = config;
    this.treasures = [];
    this.collectedCount = 0;
  }

  /**
   * 生成宝物
   */
  generate() {
    const count = this.config.treasures.count;
    const types = this.config.treasures.types;
    const walkableCells = this.mazeGenerator.getWalkableCells();

    if (walkableCells.length < count) {
      console.warn('Not enough walkable cells for all treasures');
      return;
    }

    // 随机选择宝物位置
    const selectedCells = this.selectRandomCells(walkableCells, count);

    // 创建宝物
    for (let i = 0; i < count; i++) {
      const cell = selectedCells[i];
      const type = types[i % types.length]; // 循环使用宝物类型

      // 转换为世界坐标
      const worldPos = this.gridToWorld(cell.x, cell.y);

      const treasure = new Treasure(
        this.scene,
        worldPos.x,
        worldPos.z,
        type,
        this.config
      );

      this.treasures.push(treasure);
    }
  }

  /**
   * 随机选择单元格
   */
  selectRandomCells(cells, count) {
    const selected = [];
    const available = [...cells];

    for (let i = 0; i < count && available.length > 0; i++) {
      const index = Math.floor(Math.random() * available.length);
      selected.push(available[index]);
      available.splice(index, 1);
    }

    return selected;
  }

  /**
   * 网格坐标转世界坐标
   */
  gridToWorld(gridX, gridY) {
    const cellSize = this.config.graphics.cellSize;
    return {
      x: gridX * cellSize + cellSize / 2,
      z: gridY * cellSize + cellSize / 2
    };
  }

  /**
   * 更新所有宝物
   */
  update(deltaTime) {
    for (const treasure of this.treasures) {
      if (!treasure.isCollected()) {
        treasure.update(deltaTime);
      }
    }
  }

  /**
   * 检查玩家是否碰到宝物
   */
  checkCollision(playerPos) {
    const collectionRadius = 0.5; // 收集半径

    for (const treasure of this.treasures) {
      if (treasure.isCollected()) continue;

      const treasurePos = treasure.getPosition();
      const distance = Math.sqrt(
        Math.pow(playerPos.x - treasurePos.x, 2) +
        Math.pow(playerPos.z - treasurePos.z, 2)
      );

      if (distance < collectionRadius) {
        if (treasure.collect()) {
          this.collectedCount++;
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 获取收集进度
   */
  getProgress() {
    return {
      collected: this.collectedCount,
      total: this.treasures.length
    };
  }

  /**
   * 检查是否全部收集
   */
  isAllCollected() {
    return this.collectedCount >= this.treasures.length;
  }

  /**
   * 清理所有宝物
   */
  clear() {
    for (const treasure of this.treasures) {
      treasure.dispose();
    }
    this.treasures = [];
    this.collectedCount = 0;
  }
}
