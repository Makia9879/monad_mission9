/**
 * 输入管理器 - 处理键盘、鼠标和触摸输入
 */
export class InputManager {
  constructor(domElement) {
    this.domElement = domElement;
    this.keys = {};
    this.pointer = {
      isDown: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      direction: { x: 0, y: 0 } // 记录拖拽方向
    };

    this.init();
  }

  /**
   * 初始化事件监听
   */
  init() {
    // 键盘事件
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    // 鼠标事件
    this.domElement.addEventListener('mousedown', (e) => this.onPointerDown(e));
    this.domElement.addEventListener('mousemove', (e) => this.onPointerMove(e));
    this.domElement.addEventListener('mouseup', (e) => this.onPointerUp(e));
    this.domElement.addEventListener('mouseleave', (e) => this.onPointerUp(e));

    // 触摸事件
    this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    this.domElement.addEventListener('touchcancel', (e) => this.onTouchEnd(e));

    // 防止右键菜单
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * 键盘按下
   */
  onKeyDown(event) {
    this.keys[event.key.toLowerCase()] = true;
  }

  /**
   * 键盘抬起
   */
  onKeyUp(event) {
    this.keys[event.key.toLowerCase()] = false;
  }

  /**
   * 指针按下（鼠标或触摸）
   */
  onPointerDown(event) {
    if (event.button === 0) { // 左键
      this.pointer.isDown = true;
      this.pointer.startX = event.clientX;
      this.pointer.startY = event.clientY;
      this.pointer.currentX = event.clientX;
      this.pointer.currentY = event.clientY;
      this.pointer.direction = { x: 0, y: 0 };
    }
  }

  /**
   * 指针移动
   */
  onPointerMove(event) {
    if (this.pointer.isDown) {
      this.pointer.currentX = event.clientX;
      this.pointer.currentY = event.clientY;
      this.updateDirection();
    }
  }

  /**
   * 指针抬起
   */
  onPointerUp(event) {
    this.pointer.isDown = false;
    this.pointer.direction = { x: 0, y: 0 };
  }

  /**
   * 触摸开始
   */
  onTouchStart(event) {
    event.preventDefault();
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.pointer.isDown = true;
      this.pointer.startX = touch.clientX;
      this.pointer.startY = touch.clientY;
      this.pointer.currentX = touch.clientX;
      this.pointer.currentY = touch.clientY;
      this.pointer.direction = { x: 0, y: 0 };
    }
  }

  /**
   * 触摸移动
   */
  onTouchMove(event) {
    event.preventDefault();
    if (this.pointer.isDown && event.touches.length > 0) {
      const touch = event.touches[0];
      this.pointer.currentX = touch.clientX;
      this.pointer.currentY = touch.clientY;
      this.updateDirection();
    }
  }

  /**
   * 触摸结束
   */
  onTouchEnd(event) {
    this.pointer.isDown = false;
    this.pointer.direction = { x: 0, y: 0 };
  }

  /**
   * 更新拖拽方向
   */
  updateDirection() {
    const dx = this.pointer.currentX - this.pointer.startX;
    const dy = this.pointer.currentY - this.pointer.startY;

    // 只有拖拽距离超过阈值才更新方向
    const threshold = 10;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > threshold) {
      // 归一化方向
      this.pointer.direction.x = dx / distance;
      this.pointer.direction.y = dy / distance;
    }
  }

  /**
   * 检查按键是否按下
   */
  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] === true;
  }

  /**
   * 检查指针是否按下
   */
  isPointerDown() {
    return this.pointer.isDown;
  }

  /**
   * 获取指针拖拽方向
   * @returns {Object} {x, y} 归一化的方向向量
   */
  getPointerDirection() {
    if (!this.pointer.isDown) {
      return { x: 0, y: 0 };
    }
    return { ...this.pointer.direction };
  }

  /**
   * 获取WASD移动方向
   * @returns {Object} {x, y} 归一化的方向向量
   */
  getKeyboardDirection() {
    let x = 0;
    let y = 0;

    if (this.isKeyPressed('w')) y -= 1;
    if (this.isKeyPressed('s')) y += 1;
    if (this.isKeyPressed('a')) x -= 1;
    if (this.isKeyPressed('d')) x += 1;

    // 归一化对角线移动
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 0) {
      x /= magnitude;
      y /= magnitude;
    }

    return { x, y };
  }

  /**
   * 获取当前输入方向（优先使用键盘，其次指针）
   * @returns {Object} {x, y} 归一化的方向向量
   */
  getInputDirection() {
    // 键盘输入优先
    const keyDir = this.getKeyboardDirection();
    if (keyDir.x !== 0 || keyDir.y !== 0) {
      return keyDir;
    }

    // 指针拖拽输入
    const pointerDir = this.getPointerDirection();
    return { x: pointerDir.x, y: pointerDir.y };
  }

  /**
   * 清理资源
   */
  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.domElement.removeEventListener('mousedown', this.onPointerDown);
    this.domElement.removeEventListener('mousemove', this.onPointerMove);
    this.domElement.removeEventListener('mouseup', this.onPointerUp);
    this.domElement.removeEventListener('mouseleave', this.onPointerUp);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
    this.domElement.removeEventListener('touchcancel', this.onTouchEnd);
  }
}
