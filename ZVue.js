class ZVue {
  constructor(options) {
    this._data = options.data;
    this.$el = options.el;
    this.$options = options;
    if (this.$el) {
      // 编译
      new Compile(this.$el, this);
    }
    // 数据劫持
    this.observer(this._data);
  }
  observer(data) {
    if (typeof data !== 'object' || data == null) {
      return;
    }
    const keys = Object.keys(data);
    keys.forEach(key => {
      // 转为响应式数据
      this.defineReactive(data, key, data[key])
      // 设置代理
      this.proxy('_data', key);
    });

  }
  defineReactive(target, key, value) {
    this.observer(value);
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log('get:', key)
        return value;
      },
      set(newVal) {
        console.log('set:', key)
        if (newVal !== value) {
          value = newVal;
        }
      }
    })
  }
  proxy(propertyKey, key) {
    Object.defineProperty(this, key, {
      get() {
        return this[propertyKey][key];
      },
      set(newVal) {
        this[propertyKey][key] = newVal;
      }
    })
  }
}
