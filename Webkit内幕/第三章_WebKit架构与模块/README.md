# WebKit架构与模块

## 3.1 WebKit架构及模块

<!-- ### 3.1.1 获取WebKit/ -->

### 3.1.2 WebKit架构

WebKit架构图

- 操作系统
- 图形库，网络库，存储，音频/视频库
- WebKit嵌入式接口 -> WebKit绑定
    - WebCore
        - CSS
        - SVG
        - 布局
        - 渲染树
        - HTML
        - DOM
        - Inspector
- WebKit2嵌入式接口 -> WebKit2绑定
    - JavaScriptCore
    - WebKit Ports
        - 网络栈
        - 视频
        - 文字
        - 硬件加速
        - 图片解码


## 3.2 基于Blink的Chromium浏览器结构

### 3.2.1 Chromium浏览器的架构及模块

Chromium也是基于WebKit(Blink)的，而且在WebKit的移植部分中，Chromium也做了很多有趣的事情，所以通过Chromium可以了解如何基于WebKit构建浏览器。另一方面，Chromium也是很多新技术的创新者，它将很多先进的理念引入到浏览器领域。

#### 3.2.1.1 架构和模块

Chromium模块

- Chromium浏览器, Content Shell, Android WebView
- Content接口 对渲染网页功能的抽象
- Content模块
- 4
    - Blink
    - GPU/Command Buffer
    - 沙箱模型
    - V8
    - CC(Chromium合成器)
    - IPC/UI//PPAPI


没有Content模块，浏览器的开发者也可以在WebKit的Chromium移植上渲染网页内容，但是却没有办法获得沙箱模型、跨进程的GPU硬件加速机制、众多的HTML5功能，因为这些功能很多是在Content层里实现的。

“Content模块”和“Content API”将下面的渲染机制、安全机制和插件机制等隐藏起来，提供一个接口层。该接口目前被上层模块或者其他项目使用，内部调用者包括Chromium浏览器、Content Shell等，外部包括CEF(Chromium Embedded Framework)、Opera浏览器等。

#### 3.2.1.2 多进程模型

多进程模型在不可避免地带来一些问题和复杂性的同时，也带来了更多的优势，而且这些优势非常的重要。该模型至少带来三点好处：其一是避免因单个页面的不响应或者崩溃而影响整个浏览器的稳定性，特别是对用户界面的影响；其二是，当第三方插件崩溃时不会影响页面或者浏览器的稳定性，这时因为第三方插件也被使用单独的进程来运行；其三是，它方便了安全模型的实施，也就是说沙箱模型是基于多进程架构的。其实，这很大程度上也是WebKit2产生的原因。

Chromium浏览器主要包括以下进程类型

- Browser进程
    浏览器主进程, 负责浏览器界面的展示，各个页面的管理，是所有其他类型进程的组件，负责它们的创建和销毁等工作
- Renderer进程
    网页的渲染进程，负责页面的渲染工作，Blink/WebKit的渲染工作主要在这个进程中完成，可能有多个，但是Renderer进程的数量是否同用户打开的网页数量一致呢？答案是不一定。Chromium设计了灵活的机制，允许用户配置
- NPAPI插件进程
    该进程是为NPAPI类型的插件而创建的。其创建的基本原则是每种类型的插件只会被创建一次，而且仅当使用时才被创建。当有多个网页需要使用同一种类型的插件的时候，例如很多网页需要使用Flash插件，Flash插件的进程会为每个使用者创建一个实例，所以插件进程是被共享的。
- GPU进程
    最多只有一个，当且仅当GPU硬件加速打开的时候才会被创建，主要用于对3D图形加速调用的实现。
- Pepper插件进程
- 其他进程
- Process-per-site-instance: 该类型的含义是为每一个页面都创建一个独立的Render进程，不管这些页面是否来自于同一域
- Process-per-site: 该类型的含义是属于同一个域的页面共享同一个进程，而不同属一个域的页面则分属不同的进程。好处是对于相同的域，进程可以共享，内存消耗相对较小，坏处是可能会有特别大的Renderer进程。
- Process-per-tab: 该类型的含义是，Chromium为每个标签页都创建一个独立的进程，而不管它们是否是不同域不同实例，这也是Chromium的默认行为，虽然会浪费资源。
- Single process: 该类型的含义是，Chromium不为页面创建任何独立的进程，所有渲染工作都在Browser进程中进行，它们是Browser进程中的多个线程。但是这个类型在桌面系统上只是实验性质并且不是很稳定，因而一般不推荐使用，只有在比较单进程和多进程时相对有用


#### 3.2.1.3 Browser进程和Render进程

- Browser
    - 浏览器的用户界面
    - Web Contents页面内容
    - RendererHost
- Render
    - Renderer
    - WebKit黏附层
    - WebKit接口层

上面的就是Renderer，它主要处理进程间通信，接受来自Browser进程的请求，并调用相应的WebKit接口层

#### 3.2.1.4 多线程模型

多线程的主要目的就是为了保持用户界面的高响应度，保证UI线程（Browser进程中的主线程）不会被任何其他费时的操作阻碍从而影响了对用户操作的响应

网页的加载和渲染过程:
1. Browser进程收到用户请求，UI线程先处理，然后将相应的任务交给IO线程，随机将任务传递给Renderer进程
2. Renderer进程的IO线程经过简单解释后交给渲染线程。渲染线程接受请求，加载网页并渲染网页，这其中可能需要Browser进程获取资源和需要GPU进程来帮助渲染。最后Renderer进程将结果由IO线程传递给Browser进程。
3. 最后，Browser进程接收到结果并将结果绘制出来。

Chromium中的线程间如何通信和同步呢？这是多线程领域中一个非常难缠的问题，因为这会造成死锁或者资源的竞争冲突等问题。Chromium精心设计了一套机制来处理它们，那就是绝大多数的场景使用事件和一种Chromium新创建的任务传递机制，仅在非用不可的情况下才使用锁或者线程安全对象。

#### 3.2.1.5 Content接口

Content接口不仅提供了一层对多进程进行渲染的抽象接口，而且它从诞生以来一个重要的目标就是要支持所有的HTML5功能、GPU硬件加速功能和沙箱机制，这可以让Content接口的使用者们不需要很多的工作即可得到很强大的能力

##### App
这部分主要与应用程序或者进程的创建和初始化相关，它被所有的进程使用，用来处理一些进程的公共操作，具体包括两种类型，第一类主要包括进程创建的初始化函数，也就是Content模块的初始化和关闭动作；第二类主要是各种回调函数，用来告诉嵌入者启动完成，进程启动、退出，沙盒模型初始化开始和结束等。

##### Browser
同样包括两类，第一类包括对一些HTML5功能和其他一些高级功能实现的参与，因为这些实现需要Chromium的不同平台的实现，同时需要例如Notification、Speech recognition、Web worker、Download、Geolocation等这些Content层提供的接口，Content模块需要调用它们来实现HTML5功能。第二类中的典型接口类是ContentBrowserClient，主要是实现部分的逻辑，被Browser进程调用，还有就是一些事件的函数回调。

##### Common
主要定义一些公共的接口，这些被Renderer和Browser共享，例如一些进程相关、参数、GPU相关等。

##### Plugin
仅有一个接口类，通知嵌入者Plugin进程何时被创建。

##### Renderer
该部分也包括两类，第一类包含获取RenderThread的消息循环、注册V8Extension、计算JavaScript表达式等；第二类包括ContentRendererClient，主要是实现部分逻辑，被Browser端（或者进程）调用，还有就是一些事件的函数回调。

##### Utility
工具类接口，主要包括让嵌入者参与Content接口中的线程创建和消息的过滤。

## 3.3 WebKit2

### 3.3.1 WebKit2架构及模块

相比于狭义的WebKit，WebKit2是一套全新的结构和接口，而不是一个简单的升级版。它的主要目的和思想同Chromium类似，就是将渲染过程放在单独的进程中来完成，独立于用户界面。

**自底向上**

- 4
    - 插件进程
    - 网络进程
    - WebKit(Web进程)
        - WebCore
        - JavaScript引擎
- WebKit(UI进程)
- WebKit2接口
- Application

