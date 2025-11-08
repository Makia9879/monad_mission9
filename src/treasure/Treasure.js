import * as THREE from 'three';

/**
 * 宝物类
 */
export class Treasure {
  constructor(scene, x, z, type, config) {
    this.scene = scene;
    this.x = x;
    this.z = z;
    this.type = type;
    this.config = config;
    this.mesh = null;
    this.collected = false;

    this.createMesh();
  }

  /**
   * 创建宝物模型
   */
  createMesh() {
    // 创建钻石形状的宝物
    const geometry = this.createDiamondGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(this.type.color),
      emissive: new THREE.Color(this.type.color),
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.x, 0.5, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 存储宝物数据
    this.mesh.userData = {
      type: 'treasure',
      treasureRef: this
    };

    this.scene.add(this.mesh);

    // 添加发光效果
    this.addGlow();
  }

  /**
   * 创建钻石形状几何体
   */
  createDiamondGeometry() {
    const geometry = new THREE.OctahedronGeometry(0.25, 0);
    return geometry;
  }

  /**
   * 添加发光效果
   */
  addGlow() {
    // 外层发光
    const glowGeometry = new THREE.OctahedronGeometry(0.35, 0);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.type.color),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.mesh.add(glow);

    // 添加点光源
    const light = new THREE.PointLight(new THREE.Color(this.type.color), 0.8, 5);
    light.position.set(0, 0, 0);
    this.mesh.add(light);
  }

  /**
   * 更新宝物（旋转动画）
   */
  update(deltaTime) {
    if (!this.collected && this.mesh) {
      // 旋转
      this.mesh.rotation.y += deltaTime * 2;

      // 上下浮动
      const time = Date.now() * 0.001;
      this.mesh.position.y = 0.5 + Math.sin(time * 2) * 0.1;
    }
  }

  /**
   * 收集宝物
   */
  collect() {
    if (this.collected) return false;

    this.collected = true;

    // 播放收集动画
    this.playCollectAnimation();

    return true;
  }

  /**
   * 播放收集动画
   */
  playCollectAnimation() {
    const startScale = 1;
    const endScale = 0;
    const duration = 0.5; // 秒
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      if (this.mesh) {
        // 缩放到0
        const scale = startScale + (endScale - startScale) * progress;
        this.mesh.scale.set(scale, scale, scale);

        // 向上移动
        this.mesh.position.y += 0.05;

        // 旋转加速
        this.mesh.rotation.y += 0.2;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.dispose();
        }
      }
    };

    animate();
  }

  /**
   * 获取位置
   */
  getPosition() {
    return { x: this.x, z: this.z };
  }

  /**
   * 检查是否已收集
   */
  isCollected() {
    return this.collected;
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.scene.remove(this.mesh);
      this.mesh = null;
    }
  }
}
