/**
 * 迷宫生成器 - 使用改进的递归回溯算法
 */
export class MazeGenerator {
  constructor(width, height) {
    // 确保宽高是奇数，便于生成迷宫
    this.width = width % 2 === 0 ? width - 1 : width;
    this.height = height % 2 === 0 ? height - 1 : height;
    this.cells = [];
  }

  /**
   * 生成迷宫
   * @returns {Array} 二维数组，0=墙，1=路
   */
  generate() {
    // 初始化：全部是墙
    this.cells = Array(this.height).fill(null).map(() => Array(this.width).fill(0));

    // 从(1,1)开始雕刻，使用步长为2的递归回溯
    this.carvePassagesFrom(1, 1);

    // 确保外围都是墙壁
    this.addBorderWalls();

    return this.cells;
  }

  /**
   * 递归雕刻通路（步长为2）
   */
  carvePassagesFrom(cx, cy) {
    // 标记当前位置为通路
    this.cells[cy][cx] = 1;

    // 四个方向（步长为2）
    const directions = [
      { dx: 2, dy: 0 },   // 右
      { dx: -2, dy: 0 },  // 左
      { dx: 0, dy: 2 },   // 下
      { dx: 0, dy: -2 }   // 上
    ];

    // 随机打乱方向
    this.shuffleArray(directions);

    for (const dir of directions) {
      const nx = cx + dir.dx;
      const ny = cy + dir.dy;

      // 检查新位置是否在范围内且是墙
      if (this.isValid(nx, ny) && this.cells[ny][nx] === 0) {
        // 打通当前位置和新位置之间的墙
        this.cells[cy + dir.dy / 2][cx + dir.dx / 2] = 1;

        // 递归雕刻
        this.carvePassagesFrom(nx, ny);
      }
    }
  }

  /**
   * 添加外围墙壁
   */
  addBorderWalls() {
    // 上下边界
    for (let x = 0; x < this.width; x++) {
      this.cells[0][x] = 0;
      this.cells[this.height - 1][x] = 0;
    }

    // 左右边界
    for (let y = 0; y < this.height; y++) {
      this.cells[y][0] = 0;
      this.cells[y][this.width - 1] = 0;
    }
  }

  /**
   * 随机打乱数组
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * 检查位置是否有效
   */
  isValid(x, y) {
    return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
  }

  /**
   * 检查位置是否可行走
   */
  isWalkable(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return this.cells[y][x] === 1;
  }

  /**
   * 获取所有可行走的位置
   */
  getWalkableCells() {
    const walkable = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.cells[y][x] === 1) {
          walkable.push({ x, y });
        }
      }
    }
    return walkable;
  }

  /**
   * 获取随机可行走位置
   */
  getRandomWalkableCell() {
    const walkable = this.getWalkableCells();
    if (walkable.length === 0) return { x: 1, y: 1 }; // 默认返回(1,1)
    return walkable[Math.floor(Math.random() * walkable.length)];
  }
}
