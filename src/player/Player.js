import * as THREE from 'three';

/**
 * 玩家类
 */
export class Player {
  constructor(scene, startX, startZ, config) {
    this.scene = scene;
    this.config = config;
    this.mesh = null;
    this.position = { x: startX, z: startZ };
    this.targetPosition = { x: startX, z: startZ };
    this.gridPosition = { x: 0, y: 0 };

    this.createMesh();
  }

  /**
   * 创建玩家模型
   */
  createMesh() {
    // 创建一个简单的球体作为玩家
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.4
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, 0.3, this.position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);

    // 添加一个光环效果
    this.addGlow();
  }

  /**
   * 添加发光效果
   */
  addGlow() {
    const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.mesh.add(glow);

    // 添加点光源
    const light = new THREE.PointLight(0xffff00, 1, 10);
    light.position.set(0, 0, 0);
    this.mesh.add(light);
  }

  /**
   * 设置目标位置
   */
  setTargetPosition(x, z) {
    this.targetPosition.x = x;
    this.targetPosition.z = z;
  }

  /**
   * 更新玩家位置（平滑移动）
   */
  update(deltaTime) {
    const speed = this.config.player.speed;
    const lerpFactor = Math.min(speed * deltaTime, 1);

    // 平滑插值到目标位置
    this.position.x += (this.targetPosition.x - this.position.x) * lerpFactor;
    this.position.z += (this.targetPosition.z - this.position.z) * lerpFactor;

    // 更新3D模型位置
    this.mesh.position.x = this.position.x;
    this.mesh.position.z = this.position.z;

    // 添加轻微的浮动动画
    const time = Date.now() * 0.001;
    this.mesh.position.y = 0.3 + Math.sin(time * 3) * 0.05;

    // 旋转效果
    this.mesh.rotation.y += deltaTime * 2;
  }

  /**
   * 获取当前网格位置
   */
  getGridPosition() {
    const cellSize = this.config.graphics.cellSize;
    return {
      x: Math.floor(this.position.x / cellSize),
      y: Math.floor(this.position.z / cellSize)
    };
  }

  /**
   * 获取世界坐标位置
   */
  getPosition() {
    return { ...this.position };
  }

  /**
   * 设置位置（立即移动）
   */
  setPosition(x, z) {
    this.position.x = x;
    this.position.z = z;
    this.targetPosition.x = x;
    this.targetPosition.z = z;
    this.mesh.position.x = x;
    this.mesh.position.z = z;
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.scene.remove(this.mesh);
    }
  }
}
