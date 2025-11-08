/**
 * 游戏配置加载器
 */
export class GameConfig {
  constructor() {
    this.config = null;
  }

  /**
   * 加载配置文件
   */
  async load() {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error('Failed to load config.json');
      }
      this.config = await response.json();
      return this.config;
    } catch (error) {
      console.error('Error loading config:', error);
      // 返回默认配置
      return this.getDefaultConfig();
    }
  }

  /**
   * 获取默认配置
   */
  getDefaultConfig() {
    return {
      maze: {
        width: 20,
        height: 20
      },
      treasures: {
        count: 5,
        types: [
          { name: 'ruby', color: '#FF0000' },
          { name: 'emerald', color: '#00FF00' },
          { name: 'sapphire', color: '#0000FF' }
        ]
      },
      player: {
        speed: 5,
        viewRadius: 5
      },
      graphics: {
        wallHeight: 2,
        cellSize: 1
      }
    };
  }

  /**
   * 获取配置项
   */
  get(path) {
    if (!this.config) return null;

    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return null;
      }
    }

    return value;
  }
}
