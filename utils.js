function query(el) {
  return typeof el === 'string' ? document.querySelector(el) : el;
}
const compileUtil = {
  getValue(expr, vm) {
    return expr.split('.').reduce((p, n) => {
      return p[n] || '';
    }, vm._data)
  },
  text(node, expr, vm) {
    const value = this.getValue(expr, vm)
    this.updater.textUpdater(node, value);
  },
  html(node, expr, vm) {
    const value = this.getValue(expr, vm);
    this.updater.htmlUpdater(node, value);
  },
  model(node, expr, vm) {
    const value = this.getValue(expr, vm);
    this.updater.modelUpdater(node, value);
  },
  on(node, expr, vm, eventName) {
    const method = vm.$options.methods && vm.$options.methods[expr];
    node.addEventListener(eventName, method.bind(vm));
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}