/**
 * 什么是Mock.js?
 * 
 * Mock.js是用JavaScript语言生成测试数据的第三方库，它可以用一套相对规范的模板语法让开发者自行定制测试数据的结构,
 * 然后根据模板生成用于测试的数据。
 */

/**
 * 1. Mock.js的语法规范
 * Mock.js的语法规范主要分为数据模板定义、数据模板调用和数据占位符三大模块。
 */

/**
 * 1. 数据模板定义规范
 * 
 * 数据模板中的每个属性都由三部分组成: 属性名, 生成规则, 属性值。
 */


/**
 * 2. 数据模板调用规范
 * 
 * 数据模板调用规范主要分为数据模板定义和数据模板调用两大模块。
 */

/**
 * 3. 数据占位符规范
 * 
 * 数据占位符规范主要分为数据占位符定义和数据占位符调用两大模块。
 */


// Mock.js内置的占位符可以生成常见的字符串，诸如姓名、时间、地址、段落、指定大小的图片链接、符合某个正则表达式的字符串等，只需要在数据模板的value字段处使用“@[keywords]​”的形式进行声明即可。同时，Mock.Random命名空间下也提供了与占位符同名的生成函数，开发人员可以根据自己的需求编写新的占位符

const Mock = require('mockjs');

const data = Mock.mock(
  "/get_userinfo": {
    "GET": {
      'status|1': true,
    "message": "@csentence(10, 20)",
    "data": {
      "id|1-20": 1,
      "name": "@cname",
      "age|18-28": 18,
      "gender|1": ["男", "女"],
      "email": "@email",
      "phone": "@phone",
      "address": "@county(true)",
      "avatar": "@image(100x100)",
      "create_time": "@datetime"
    }
  }
})

console.log(data);
