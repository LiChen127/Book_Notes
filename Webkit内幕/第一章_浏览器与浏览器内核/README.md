# 浏览器与浏览器内核

## 1.1 浏览器

### 1.1.1 浏览器简介

Berners-Lee在八十年代后期九十年代初期发明了世界上第一个浏览器WorldWideWeb(Nexus)支持早期的HTML

MarcAndreessen领导开发了网景浏览器

95年，IE逐渐取代了网景浏览器，第一代浏览器大战结束

1998年网景公司开发了Firefox浏览器

2003年苹果发布了Safari，释放了重要部件的源代码，发起了WebKit项目

2008年，谷歌以WebKit为内核，创建了Choromium项目

在Chromium项目的基础上，Google发布了自己的浏览器产品Chrome。不同于WebKit之于Safari浏览器，Chromium本身就是一个浏览器，而不是Chrome浏览器的内核，Chrome浏览器一般选择Chromium的稳定版本作为它的基础。Chromium是开源试验场，它会尝试很多创新并且大胆的技术，当这些技术稳定之后，Chrome才会把它们集成进来，也就是说Chrome的版本会落后于Chromium

### 1.1.2 浏览器特性

- 网络
- 资源管理
- 网页浏览
- 多页面管理
- 插件和拓展
- 账户同步
- 安全
- 开发者工具
- 多操作系统支持

### 1.1.3 HTML

HTML(HyperText Markup Language)超文本标记语言，用于网页的创建和其他信息在浏览器中的展示
1999 -> 4.01版本

HTML5的出现是划时代的，包含了十大类别标准

1. 离线: Application cache, LocalStorage, IndexedDB, 离线/在线事件
2. 存储: Application cache,等
3. 连接: WebSocket, Server-sent事件
4. 文件访问: File API, File Stream, Fire Writer, ProgressEvents
5. 语义: 各种新的元素, Media, structural, 国际化，Link relation, 属性, form类型, microdata等
6. 音频和视频: HTML5 Video, Web Audio, WebRTC, Video track
7. 3D和图形: Canvas2D 3D CSS变化，WebGL, SVG
8. 展示: CSS3 2D/3D变换，转换，字体
9. 性能: Web Worker, HTTP caching
10. 其他: 触控，鼠标，Shadow DOM, CSS making


在HTML历史上的早期阶段，网页内容是静态的，也就是说内容是不能动态变化的。服务器将内容传给浏览器之后，页面显示结果就固定不变了，这显然难以满足各种各样的现实需求。随后JavaScript语言诞生了，该语言是EMCAScript规范的一种实现。因为最初还有其他用于网页的脚本语言，例如JScript。所以，标准化组织制定了脚本语言的规范，也就是EMCAScript。而JavaScript作为其中的一个实现，受到了极为广泛的使用。虽然JavaScript语言的定义受到了众多的批评，但是如今，网页已经离不开它了，HTML5中的很多规范都是基于JavaScript语言来定义的。网页第三个革命性成果是CSS(Cascading Style Sheet)，也就是级联样式表。因为早期阶段的网页不仅是静态的，而且表现形式非常固定和简单，所以内容没有办法以各种可视化处理效果展示出来。引入了CSS之后，这一技术使得内容和显示分离开来，对网页开发来说，极大地增强了显示效果并提升了开发效率。

伴随着HTML技术的发展，另一个技术是HTTP， 构建于TCP/IP之上的应用层协议，用于传输HTML文本和所涉及到的各种资源，包括图片和多媒体。
之后HTTPS, 加入了SSL/TLS

### 1.1.4 用户代理和浏览器行为

用户代理(User Agent)作用是表明浏览器的身份

## 1.2 浏览器内核及特性

### 1.2.1 内核和主流内核

在浏览器中，有一个最重要的模块，它主要的作用是将页面转变成可视化（准确讲还要加上可听化）的图像结果，这就是浏览器内核。通常，它也被称为渲染引擎。

渲染: 就是根据描述/定义构建数学模型，通过模型生成图像的过程。

浏览器的渲染引擎就是能够将HTML/CSS/JavaScript文本及其相应的资源文件转换成图像结果的模块

主流的渲染引擎: Trident(IE内核), Gecko(Firefox), Webkit(Chrome)

事实上，同一个渲染引擎（虽然可能有很多不同的变化）可以被多个浏览器所采用

### 1.2.2 内核特征

一个渲染引擎要包括的功能

主要三层:
1. 第一层
    - HTML解释器
    - CSS解释器
    - Layout
    - JavaScript引擎
2. 第二层
    - 网络
    - 存储
    - 2D/3D图形
    - 音频/视频
    - 图片解码
3. 第三层 操作系统支持
    - 多线程
    - 文件

### 1.3 WebKit内核

#### 1.3.1 WebKit介绍

广义WebKit和侠义WebKit
前者指的就是这个项目

后者: WebKit嵌入式接口

- WebKit嵌入式接口(API)
- WebCore
- JavaScript引擎
- 调用系统或依赖库接口的桥接层

#### 1.3.2 WebKit和WebKit2

这里说的WebKit不是指开源项目WebKit，而是前面说到的狭义上的绑定和接口层。同样的，WebKit2也是一个狭义上的绑定和接口层。但是，WebKit2不是WebKit绑定和接口层的简单修改版，而是一组支持新架构的全新绑定和接口层。在Chromium项目中，为了网页浏览环境的安全性和稳定性原因考虑而引入了跨进程的架构后，WebKit开源项目也一直希望加入这方面的支持。可惜，这个特性一直没有被加入到WebKit项目中来。

2010年4月，苹果宣布了WebKit2，目的是抽象出一组新的编程接口，该接口和调用者代码与网页的渲染工作代码不在同一个进程，这显然有了Chrominum多进程的优点, 但是与此同时，WebKit2接口的使用者不需要理解和接触背后的多进程和进程间通信等复杂机制，WebKit2部分代码也属于WebKit项目

WebKit2的进程模型:
- UI进程(Webkit2绑定和接口层所在的进程)
- Web进程(渲染进程)

#### 1.3.3 Chromium内核: Blink

Google希望在Blink中看到的

1. 跨进程的iframe
2. 重新整理架构和接口
3. 将DOM树引入JavaScript引擎
4. 性能优化

