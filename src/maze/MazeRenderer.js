import * as THREE from 'three';

/**
 * 迷宫渲染器
 */
export class MazeRenderer {
  constructor(scene, mazeData, config) {
    this.scene = scene;
    this.mazeData = mazeData;
    this.config = config;
    this.walls = new THREE.Group();
    this.floor = null;
    this.scene.add(this.walls);
  }

  /**
   * 渲染迷宫
   */
  render() {
    this.createFloor();
    this.createWalls();
  }

  /**
   * 创建地板
   */
  createFloor() {
    const cellSize = this.config.graphics.cellSize;
    const width = this.mazeData.width * cellSize;
    const height = this.mazeData.height * cellSize;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc, // 更亮的灰色地板
      roughness: 0.8,
      metalness: 0.2
    });

    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.x = -Math.PI / 2; // 水平放置
    this.floor.position.set(
      width / 2,
      0,
      height / 2
    );
    this.floor.receiveShadow = true;

    this.scene.add(this.floor);
  }

  /**
   * 创建墙壁
   */
  createWalls() {
    const cellSize = this.config.graphics.cellSize;
    const wallHeight = this.config.graphics.wallHeight;

    // 墙壁几何体和材质（复用以提高性能）
    const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, cellSize);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // 棕色墙壁，更明显
      roughness: 0.7,
      metalness: 0.3
    });

    let wallCount = 0;
    for (let y = 0; y < this.mazeData.height; y++) {
      for (let x = 0; x < this.mazeData.width; x++) {
        if (this.mazeData.cells[y][x] === 0) {
          wallCount++;
          // 这是一堵墙
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            x * cellSize + cellSize / 2,
            wallHeight / 2,
            y * cellSize + cellSize / 2
          );
          wall.castShadow = true;
          wall.receiveShadow = true;

          // 存储网格坐标，用于碰撞检测
          wall.userData = { gridX: x, gridY: y, type: 'wall' };

          this.walls.add(wall);
        }
      }
    }
    console.log(`Created ${wallCount} walls`);
  }

  /**
   * 清除迷宫
   */
  clear() {
    // 清除墙壁
    while (this.walls.children.length > 0) {
      const wall = this.walls.children[0];
      wall.geometry.dispose();
      wall.material.dispose();
      this.walls.remove(wall);
    }

    // 清除地板
    if (this.floor) {
      this.floor.geometry.dispose();
      this.floor.material.dispose();
      this.scene.remove(this.floor);
      this.floor = null;
    }
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
   * 世界坐标转网格坐标
   */
  worldToGrid(worldX, worldZ) {
    const cellSize = this.config.graphics.cellSize;
    return {
      x: Math.floor(worldX / cellSize),
      y: Math.floor(worldZ / cellSize)
    };
  }
}
