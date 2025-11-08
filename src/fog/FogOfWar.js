import * as THREE from 'three';

/**
 * 战争迷雾系统
 */
export class FogOfWar {
  constructor(scene, mazeData, config) {
    this.scene = scene;
    this.mazeData = mazeData;
    this.config = config;
    this.fogMesh = null;
    this.material = null;

    this.createFog();
  }

  /**
   * 创建迷雾
   */
  createFog() {
    const width = this.mazeData.width * this.config.graphics.cellSize;
    const height = this.mazeData.height * this.config.graphics.cellSize;

    // 创建自定义shader材质
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        playerPos: { value: new THREE.Vector2(0, 0) },
        viewRadius: { value: this.config.player.viewRadius },
        fogColor: { value: new THREE.Color(0x000000) },
        mazeSize: { value: new THREE.Vector2(width, height) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec2 playerPos;
        uniform float viewRadius;
        uniform vec3 fogColor;
        uniform vec2 mazeSize;

        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
          // 计算到玩家的距离
          vec2 pos = vWorldPosition.xz;
          float dist = distance(pos, playerPos);

          // 计算alpha值（距离越远越不透明）
          float alpha = smoothstep(viewRadius - 0.5, viewRadius + 0.5, dist);

          // 输出颜色，完全不透明
          gl_FragColor = vec4(fogColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide
    });

    // 创建迷雾平面
    const geometry = new THREE.PlaneGeometry(width, height);
    this.fogMesh = new THREE.Mesh(geometry, this.material);
    this.fogMesh.rotation.x = -Math.PI / 2;
    this.fogMesh.position.set(
      width / 2,
      0.6, // 稍微高于地面，但低于墙壁和玩家
      height / 2
    );

    // 设置渲染顺序
    this.fogMesh.renderOrder = 1;

    this.scene.add(this.fogMesh);
  }

  /**
   * 更新迷雾（根据玩家位置）
   */
  update(playerX, playerZ) {
    if (this.material) {
      this.material.uniforms.playerPos.value.set(playerX, playerZ);
    }
  }

  /**
   * 设置视野半径
   */
  setViewRadius(radius) {
    if (this.material) {
      this.material.uniforms.viewRadius.value = radius;
    }
  }

  /**
   * 清理资源
   */
  dispose() {
    if (this.fogMesh) {
      this.fogMesh.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.fogMesh);
      this.fogMesh = null;
      this.material = null;
    }
  }
}
