import * as THREE from 'three';

/**
 * 场景管理器
 */
export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    this.init();
  }

  /**
   * 初始化场景
   */
  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a); // 深灰色背景
    // 暂时禁用Three.js雾效，只使用迷雾平面
    // this.scene.fog = new THREE.Fog(0x000000, 5, 15);

    // 创建相机（透视相机，上帝视角）
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(10, 20, 25); // 提高初始高度
    this.camera.lookAt(10, 0, 10);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 设置光照
    this.setupLights();

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * 设置光照
   */
  setupLights() {
    // 环境光 - 提高亮度
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // 定向光（主光源）- 提高亮度
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;

    // 设置阴影参数
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;

    this.scene.add(directionalLight);

    // 添加一点点方向光作为补光
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.2);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);
  }

  /**
   * 更新相机位置（跟随玩家）
   */
  updateCamera(playerX, playerZ, mazeWidth, mazeHeight, cellSize) {
    // 相机偏移量（从玩家位置向后上方偏移）
    const offsetX = 0;
    const offsetY = 20; // 提高高度，看得更远
    const offsetZ = 15;  // 向后偏移更多

    // 计算相机位置
    this.camera.position.set(
      playerX + offsetX,
      offsetY,
      playerZ + offsetZ
    );

    // 相机看向玩家位置
    this.camera.lookAt(playerX, 0, playerZ);
  }

  /**
   * 窗口大小改变处理
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * 渲染场景
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 获取场景
   */
  getScene() {
    return this.scene;
  }

  /**
   * 获取相机
   */
  getCamera() {
    return this.camera;
  }

  /**
   * 获取渲染器
   */
  getRenderer() {
    return this.renderer;
  }

  /**
   * 获取时钟
   */
  getClock() {
    return this.clock;
  }

  /**
   * 清理资源
   */
  dispose() {
    window.removeEventListener('resize', () => this.onWindowResize());
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
