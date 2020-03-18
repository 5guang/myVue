

class Compile {
  constructor(el, vm) {
    this.el = query(el);
    this.vm = vm;
    // 1、创建文档碎片
    const fragment = this.node2Fragment(this.el);
    // 2、编译模板
    this.compile(fragment);
    // 3、追加子元素到根元素
    this.el.appendChild(fragment)
  }
  node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment;
  }
  compile(el) {
    const childNodes = el.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        // 编译元素节点
        this.compileElement(child)
      } else if (this.isText(child)) {
        // 编译文本节点
        this.compileText(child)
      }
      // 判断是否有子元素 递归遍历
      if (child.childNodes && child.childNodes.length) {
        this.compile(child)
      }
    })
  }
  compileElement(node) {
    // 取出所有属性
    const attributes = node.attributes;
    [...attributes].forEach(attr => {
      const { name, value } = attr;
      // 判断是否为指令 z-text z-html ...
      if (this.isDirective(name)) {
        const [, dirctive] = name.split('-');
        const [dirName, eventName] = dirctive.split(':');
        // 具体编译各个不同指令的方法
        compileUtil[dirName](node, value, this.vm, eventName);
        // 删除有指令的标签上的属性
        node.removeAttribute('z-' + dirctive);
      } else if (this.isEventName(name)) {
        const eventName = name.split('@')[1];
        compileUtil['on'](node, value, this.vm, eventName);
      }
    })
  }
  compileText(node) {
    const content = node.textContent;
    const reg = /{\{(.+?)\}\}/;
    if (reg.test(content)) {
      compileUtil['text'](node, RegExp.$1, this.vm);
    }
  }
  isEventName(attr) {
    return attr.includes('@');
  }
  isDirective(name) {
    return name.includes('z-')
  }
  // 判断是否是元素节点
  isElementNode(node) {
    return node && node.nodeType === 1;
  }
  // 是否是文本节点
  isText(node) {
    return node && node.nodeType === 3;
  }

}