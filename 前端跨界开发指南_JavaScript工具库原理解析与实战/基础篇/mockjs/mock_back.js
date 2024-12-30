/**
 * Mock.js的基本原理
 */

/**
 * 1.4.1 从模板到数据
 * 
 * Mock.js的核心功能是将特殊标记的语法转换为对应的模拟数据， 可以看作是简单的DSL(Domain-Specific Language)领域特定语言转换器
 * DSL并不是一种具体的语言，而是泛指任何针对指定领域的语言，它并不一定会有严格的标准，也可能仅仅是一种约定规范。在未来的前端开发中还会出现很多类似的任务，比如当下非常热门的“可视化搭建”技术，就是围绕DSL解析来实现的。
 */

/**
 * 转换策略单例
 */
const Strategy = {
  'String': (rule, value) => {
    return value;
  },
  'Number': (rule, value) => {
    return value;
  },
  'Boolean': (rule, value) => {
    return value;
  },
  'Object': (rule, value) => {
    return value;
  },
  'Array': (rule, value) => {
    return value;
  },
}


/**
 * 模板转换函数
 */

function parseTemplate(schema = {}) {
  let result = {};
  for (let prop of Object.keys(schema)) { 
    let [name, rule] = prop.split('|');
    let value = Strategy[rule](rule, schema[prop]);
    result[name] = value;
  }
  return result;
}

/**
 * 简单学习一下代理模式
 */

/**
 * Vue2中数组方法的代理模式实现
 */

const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
];

methodsToPatch.forEach(method => {
  const original = arrayProto[method];
  arrayMethods[method] = function(...args) {
    const result = original.apply(this, args);
    return result;
  }
})
