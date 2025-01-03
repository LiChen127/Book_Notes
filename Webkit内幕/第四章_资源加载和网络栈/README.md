# 第四章 资源加载和网络栈

## 4.1 WebKit资源加载机制

### 4.1.1 资源

网络和资源加载是网页的加载和渲染过程中的第一步，也是必不可少的一步。网页本身就是一种资源，而且网页一般还需要依赖很多其他类型的资源，例如图片、视频等。因为资源的加载涉及网络和资源的缓存等机制，而且它们在整个渲染过程中占的比例并不少。

HTML支持的资源主要包括以下类型:

- HTML
- JavaScript
- CSS
- 图片
- SVG: 用于绘制SVG的2D矢量图形表示
- CSS Shader
- 视频，音频，字幕
- 字体文件
- XSL样式表

上面这些资源在WebKit中均有不同的类来表示它们，它们的公共基类是CachedResource。

### 4.1.2 资源缓存

资源的缓存机制是提高资源使用效率的有效方法。

**基本思想**: 建立一个缓存池，当WebKit需要请求资源的时候，先从资源池中查找是否存在相应的资源。如果存在，WebKit则取出以便调用; 如果没有，WebKit创建一个新的CachedResource子类对象，并发送真正的请求给服务器, WebKit收到资源之后，将资源保存到缓存池中，以便下次使用。(这里的缓存指的是内存缓存， 不同于磁盘缓存)

WebKit从资源池中查找资源的关键字是URL， 因为标记资源唯一性的特征就是资源的URL。

### 4.1.3 资源加载

按照加载器的类型划分，WebKit的资源加载器可以分为以下几种:

- 针对每种资源类型的特定加载器，其特点是仅加载某一种资源。例如对于“image”这个HTML元素，该元素需要图片资源，对应的特定资源加载器是ImageLoader类。对于CSS自定义字体，它的特定资源加载器是FontLoader类。这些资源加载器没有公共基类，其作用就是当需要请求资源的时候，由资源加载器负责加载并隐藏背后复杂的逻辑。
- 资源缓存机制的资源加载器特点是: 所有特定加载器都共享它来查找并插入缓存资源--CachedResourceLoader类。特定加载器先通过缓存机制的资源加载器来查找是否有缓存资源，它属于HTML的文档对象。
  举个例子:
    1. 获取CachedResourceLoader对象 -> ImageLoader -> HTMLDocument
    2. CachedResourceLoader对象的find方法， 通过URL查找资源
- 通用加载器-ResourceLoader类， 是在WebKit需要从网络或者文件系统获取资源的时候使用该类只负责获得资源的数据，因此被所有特定加载器共享。它属于CachedResource类。同CachedResourceLoader类没有继承关系。

### 4.1.4 过程

鉴于从网络获取资源是一个非常耗时的过程，通常一些资源的加载是异步执行的，也就是说资源的获取和加载不会阻碍当前WebKit的渲染过程，例如图片、CSS文件。当然，网页也存在某些特别的资源会阻碍主线程的渲染过程，例如JavaScript代码文件。这会严重影响WebKit下载资源的效率，因为后面可能还有许多需要下载的资源，WebKit怎么做呢？

主线程被阻塞了，后面的解析工作无法进行，所以对于HTML后面使用的资源也没有办法直到并发送下载请求。

**WebKit是这么做的: 当主线程被阻塞时, WebKit会启动另外一个线程去遍历后面的HTML页面，收集所需要的资源URL，然后发送请求，这样就可以避免主线程被阻塞。与此同时，WebKit会并发去下载这些资源，甚至并发下载JavaScript文件。**

### 4.1.5 资源的生命周期

同CachedResourceLoader对象一样，资源池也属于HTML文档对象。

**资源池中的资源生命周期是什么?**

资源池不能无限放大，必须用相应的机制来替换其中的资源，从而加入新的资源。资源池所用的机制很简单，就是采用LRU(Least Recently Used)算法。
另一方面，当一个资源被加载后，它会被放入资源池，以便之后使用。

问题是，WebKit如何判断下次使用的时候是否需要更新该资源从而对服务器重新请求呢？因为服务器可能在某段时间之后更新了该资源。

考虑这样的场景，当用户打开网页后，他想刷新当前的页面。这种情况下，资源池会出现怎样的情况呢？是清除所有的资源，重新获得呢？还是直接利用当前的资源？都不是。对于某些资源，WebKit需要直接重新发送请求，要求服务器端将内容重新发送过来。但对于很多资源，WebKit则可以利用HTTP协议减少网络负载。在HTTP协议的规范中对此有规定，浏览器可以发送消息确认是否需要更新，如果有，浏览器则重新获取该资源；否则就需要利用该资源

WebKit的做法: 首先判断资源是否在资源池中，如果是，则发送一个HTTP请求，说明该资源在本地的信息，例如该资源什么时候修改的，服务器根据它做判断，如果没有任何变化，则返回304状态码，表示资源没有变化，浏览器则直接使用本地资源。如果资源发生变化，则返回200状态码，浏览器则重新获取该资源。

**WebKit在"关闭缓存"之后发生了什么？**

首先，开发者工具中直接清除掉MemoryCache对象中的所有资源，MemoryCache对象全局唯一。在清除掉该对象中的资源之后，WebKit立刻重新打开缓存机制。

## 4.2 Chromium多进程资源加载

### 4.2.1 多进程

资源的实际加载在各个WebKit的移植有所不同。Chromium采用多进程加载

![alt text](image.png)

- Render进程
  - WebCore
    - ResourceHandle
  - WebKit/Chromium
    - IOThread
    - ResourceDispatcher
    - IPCResourceLoaderBridge
    - WebURLLoaderImpl
    - ResourceHandleInternal
- Browser进程
  - IOThread && ResouceMessageFilter
  - ResourceDispatcherHostImpl
  - content::ResouceLoader
  - net::URLRequest

Renderer进程在网页的加载过程中需要获取资源，但是由于安全性(沙箱模型打开后，Renderer进程无权去获取资源)和效率上的考虑，Renderer进程的资源获取实际上是通过进程间通信将任务交给Browser进程来完成，Browser进程有权限从网络/本地获取资源。

在Chromium架构的Renderer进程中，ResourceHandleInternal类通过IPCResource-LoaderBridge类同Browser进程通信。IPCResourceLoaderBridge类继承自ResourceLoaderBridge类，其作用是负责发起请求的对象和回复结果的解释工作，实际消息的接收和派发交给ResourceDispatcher类来处理。

在Browser进程中，首先由ResourceMessageFilter类来过滤Renderer进程的消息，如果与资源请求相关，则该过滤类转发请求给ResourceDispatcherHostImpl类，随即ResourceDispatcherHostImpl类创建Browser进程中的ResourceLoader对象来处理。ResourceLoader类是Chromium浏览器实际的资源加载类，它负责管理向网络发起的请求、从网络接收过来的认证请求、请求的回复管理等工作。因为这其中每项都有专门的类来负责，但都是由ResourceLoader类统一管理。从网络或者本地文件读取信息的是URLRequest类，实际上它承担了建立网络连接、发送请求数据和接受回复数据的任务

### 4.2.2 工作方式和资源共享

资源请求有同步和异步两种方式。

资源统一交由Browser进程来处理，这使得资源在不同网页间的共享变得很容易。接下来面临一个问题，因为每个Renderer进程某段时间内可能有多个请求，同时还有多个Renderer进程，Browser进程需要处理大量的资源请求，这就需要一个处理这些请求的调度器，这就是Chromium中的ResourceScheduler。

ResourceScheduler类管理的对象就是顶层类net::URLRequest，它负责管理URLRequest的创建、销毁、调度等。
根据URLRequest的标记和优先级来调度URLRequest对象，每个URLRequest对象都有一个ChildId和RouteId来标记属于哪个Renderer进程。
ResourceScheduler类中有一个哈希表，该表按照进程来组织URLRequest对象。
对于这些类型的网络请求，立即被Chromium发出

1. 高优先级的请求
2. 同步请求
3. 具有SPDY协议的请求

## 4.3 网络栈

### 4.3.1 WebKit的网络设施

WebKit的资源加载其实是交由各个移植来实现的，所以WebCore其实并没有什么特别的基础设施，每个移植的网络实现是非常不一样的。

### 4.3.2 Chromium的网络栈

#### 4.3.2.1 网络栈的基本组成

![alt text](image-1.png)

#### 4.3.2.2 网络栈结构

**网络栈调用过程解析**

1. URLRequest类被上层调用并启动请求时，会根据URL的"scheme"来决定需要创建什么类型的请求("schema"就是URL的协议类型，例如http、https、ftp等)。URLRequest对象创建的时一个URLRequestJob子类的一个对象。例如图中的URLRequestHttpJob类。为了支持自定义的scheme处理方式，Chromium使用工厂模式。URLRequestJob类和它的工厂类URLRequestJobFactory的管理工作都由URLRequestJobManager类负责。基本的思路是，用户可以在该类中注册多个工厂，当有URLRequest请求时，先由工厂检查它是否需要处理该“scheme”​，如果没有，工厂管理类继续交给下一个工厂类来处理。最后，如果没有任何工厂能够处理，Chromium则交给内置的工厂来检查和处理是否为“http://”​、​“ftp：//”或者“file：//”等
2. 当URLRequestHttpJob对象被创建之后，该对象首先从Cookie管理器中获取与URL相关联的信息。之后，它同样借助于HttpTransactionFactory类来创建HttpTransaction对象来开启一个HTTP连接的事务。通常，HttpTransactionFactory对象对应的是它的一个子类HttpCache对象。HttpCache使用本地磁盘缓存机制，如果该请求对应的回复已经在磁盘缓存中了，那么Chromium无需再建立HttpTransaction来发起连接，而是直接从磁盘中获取。如果磁盘中没有该URL的缓存，同时如果目前该URL请求对应的HttpTransaction已经建立，那么只要等待它的回复即可。当这些条件都不满足的时候，Chromium实际上才会真正创建HttpTransaction对象。
3. HttpNetworkTransaction类使用HttpNetworkSession类来管理连接会话。HttpNetworkSession类通过它的成员HttpStreamFactory对象来建立TCP Socket连接，之后Chromium创建HttpStream对象。HttpStreamFactory对象将和网络之间的数据读写交给自己新创建的一个HttpStream子类的对象来处理。
4. 套接字的建立。Chromium中与服务器建立连接的套接字是StreamSocket类，是一个抽象类，同时为了支持SSL，Chromium又创建了SSLSocket类。

#### 4.3.2.3 代理

当用户设置代理时，上面的网络栈结构是如何组织的呢？用户代理依赖以下类来处理。

- ProxyService: 对于一个URL，HttpStreamFactory类使用ProxyService类来获取代理信息。ProxyService类首先会检查当前的代理设置是不是最新的，如果不是，它依赖ProxyConfigService来重新获取代理信息。该类不处理实际任务，而是使用ProxyResolver类来做实际的代理工作。
- ProxyConfigService: 该类负责从注册表中获取代理信息，并使用ProxyResolver类来解析代理信息。
- ProxyScriptFetcher: Chromium支持代理的JavaScript脚本，该类负责从代理的URL中获取该脚本。
- ProxyResolver: 实际负责代理的解释与执行，通常采用新的线程来处理，因为当前可能会被域名的解析所阻碍
- ProxyResolverV8: 该类是ProxyResolver的子类，它使用V8引擎来解析代和执行脚本

**代理的过程**

1. ProxyConfigService类从注册表中获取代理信息，并使用ProxyResolver类来解析代理信息。
2. 系统代理设置
3. ProxyResolver类解析代理信息，并使用ProxyScriptFetcher类获取代理的JavaScript脚本。 -> ProxyService
4. ProxyScriptFetcher类从代理的URL中获取代理的JavaScript脚本。
5. ProxyResolverV8类解析代理的JavaScript脚本，并执行。
6. ProxyInfo -> ProxyService

#### 4.3.2.4 域名解析(DNS)

通常用户都是使用域名来访问网络资源，所以建立TCP连接之前需要解析域名。Chromium中使用HostResolverImpl类来完成域名解析。具体调用 "getaddrinfo()" 该函数是一个阻塞式的函数，所以Chromium使用一个单独的线程来处理它。

同时为了考虑效率，使用HostCache类来保存解析后的域名。

### 4.3.3 磁盘本地缓存

#### 4.3.3.1 特性

- 磁盘空间不是无限大，要有合适的机制移除缓存
- 确保在浏览器崩溃时不破坏磁盘文件，至少保护原先在磁盘中的数据
- 可以高效和快速地访问磁盘中现有的数据结构，支持同步和异步两种访问方式
- 能够避免同时存储两个相同的资源
- 能够很方便地从磁盘中删除一个项
- 磁盘不支持多线程访问
- 版本兼容

#### 4.3.3.2 结构

主要两个类

1. Backend 表示整个磁盘缓存，所有针对磁盘缓存操作的主入口，表示的是一个缓存表
2. Entry 表中的表项。

缓存指的是一个表，对于整个表的操作作用在Backend类上，而Entry类则表示表中的一个表项。每个项由关键字来唯一确定，该关键字是URL的哈希值。而对于项目内的操作，则作用在Entry类上。

#### 4.3.4 Cookie机制

Cookie格式就是一系列的键值对，每个键值对之间用分号隔开。

根据Cookie的时效性，可以将Cookie分为两种类型:

1. 会话型Cookie(Session Cookie): 这些Cookie只是保存在内存中，当浏览器退出时即可清除这些Cookie。 **如果没有设置时间，就是会话型Cookie**
2. 持续型Cookie(Persistent Cookie): 浏览器退出仍然保留Cookie的内容。该类型的Cookie在创建的时候，需要设置一个过期时间。有效期内，每次访问该Cookie所属域的时候，需要将Cookie发送给服务器。

Chromium中关于Cookie所设计和使用的主要类及其关系。

CookieManager类是Chromium中Cookie机制的入口，相当于Cookie管理器。

1. 实现CookieStore的接口，对外->调用者可以设置和获得Cookie
2. 报告各种Cookie的事件，比如更新信息
3. Cookie对象的集合(CanonicalCookie的集合)，每个CanonicalCookie对象表示一个域的Cookie结合。
4. 持续型Cookie的存储(需要保存到磁盘时使用PersistentCookieStore类)

### 4.3.5 安全机制

HTTP是一种使用明文来传输数据的应用层协议。构建在SSL之上的HTTPS提供了安全的网络传输机制，现已被广泛应用于网络上。典型的是电子商务、银行支付方面的应用。基本上所有的浏览器都支持该协议，Chromium当然也不例外，这些会在第12章安全机制中作介绍。不仅如此，Chromium也支持一种新的标准，这就是HSTS(HTTP Strict Transport Security)。该协议能够让网络服务器声明它只支持HTTPS协议，所以浏览器能够理解服务器的声明，发送基于HTTPS的连接和请求。通常情况下，浏览器的用户不会输入“scheme(http://)”​，浏览器的补齐功能通常会加入该“scheme”​，但是，服务器可能需要“https://”​。在这样的情况下，该协议就显得非常有用。一般情况下，服务在返回的消息头中加入以下信息表明它支持该标准：

Strict-Transport-Security: max-age=31536000; includeSubDomains

### 4.3.6 高性能网络栈

Chromium的网络模块有两个重要目标，其一是安全，其二是速度。为此，该项目引入了很多WebKit所没有的新技术，这是一个很好的学习对象。

#### 4.3.6.1 DNS预取和TCP预连接(Preconnect)

一次DNS查询的平均时间大概是60～120ms之间或者更长，而TCP的三次握手时间大概也是几十毫秒或者更长。看似一个很短的时间，但是相对于网页的渲染来说，这是一个非常长的时间。如何有效地减少这段时间，Chromium给出了自己的答案——DNS预取和TCP预连接，它们都是由Chromium的“Predictor”机制来实现的。

首先是DNS预取。主要思想是: **利用现有的DNS机制，提前解析网页中可能的网络连接**。
具体来说，当用户正在浏览当前网页的时候，Chromium提取网页中的超链接，将域名抽取出来，利用比较少的CPU和网络带宽来解析这些域名或IP地址，这样一来，用户根本感觉不到这一过程。当用户单击这些链接的时候，可以节省不少时间，特别在域名解析比较慢的时候，效果特别明显

DNS预取的实现:并不是利用Chromium网络栈，而是直接利用系统的域名解析机制，好处是它不会阻塞当前网络栈的工作。DNS预取技术针对多个域名采取并行处理，每个域名的解析必须由新开启的一个线程来处理，结束后线程即退出。

网页的开发者可以显示指定预取哪些域名来让Chromium解析，这非常直截了当，特别对于那些需要重定向的域名，具体做法如下所示：`＜link rel="dns-prefetch"href="http://this-is-a-dns-prefetch-example.com"＞`。当然，DNS预取技术不仅应用于网页中的超链接，当用户在地址栏中输入地址后，候选项同输入的地址很匹配的时候，在用户敲下回车键获取该网页之前，Chromium已经开始使用DNS预取技术解析该域名了。

Chromium使用追踪技术来获取用户从什么网页跳转到另外一个网页。可以利用这些数据、一些启发式规则和其他一些暗示来预测用户下面会单击什么超链接，当有足够的把握时，它便先DNS预取，更进一步，还可以预先建立TCP连接。听起来够智能的吧？是的，但是这对用户的隐私是一个极大的挑战，它甚至能预测你单击什么超链接！

同DNS预取技术一样，追踪技术不仅应用于网页中的超链接，当用户在地址栏中输入地址，如候选项同输入的地址很匹配，则在用户敲下回车键获取该网页之前，Chromium就已经开始尝试建立TCP连接了。

#### 4.3.6.2 HTTP管线化(Pipelining)

我们知道，很多时候，服务器和浏览器通信是按顺序来的，也就是说，浏览器发送一个请求给服务器，等到服务器的回复后，才会发送另外一个请求。这样做的弊端是效率极差。

HTTP1.1中引入了管线化技术，它允许浏览器发送多个请求，而不需要等待回复，这样可以减少整体的响应时间。

Chromium中，也支持，但是需要服务器的配合，两者才能实现HTTP管线化。

HTTP管线化技术是一项同时将多个HTTP请求一次性提交给服务器的技术，无需等待服务器的回复，因为它可能将多个HTTP请求填充在一个TCP数据包内。HTTP管线化需要在网络上传输较少的TCP数据包，减少了网络负载。

请求结果的管线化使得HTML网页加载时间动态提升，特别是在具体有高延迟的连接环境下。在速度较快的网络连接环境下，提速可能不是很明显。因为，这些请求还是有明显的先后顺序。
管线化机制需要通过**永久连接(Persistent Connection)**完成，并且**只有GET和HEAD等请求可以进行管线化**，使用场景有很大的限制。

#### 4.3.6.3 使用SPDY协议

SPDY就是为了解决网络延迟和安全性问题。

根据Google的官方数据，使用SPDY协议的服务器和客户端可以将网络加载的时间减少64%，好消息是，在HTTP2.0的草案中将引入SPDY协议，将其作为基础来编写。

SPDY协议是一种新的会话层协议，因为网络协议是一种栈式结构，它被定义在HTTP协议和TCP协议之间

1. HTTP(应用层)
2. SPDY(会话层)
3. SSL(表示层)
4. TCP(传输层)

SPDY协议的核心思想是多路复用，仅使用一个连接来传输一个网页中的众多资源。

它本质上并没有改变HTTP协议，只是将HTTP协议头通过SPDY来封装和传输。数据传输方式也没有发生变化，也是使用TCP/IP协议。所以，SPDY协议相对比较容易部署，服务器只需要插入SPDY协议的解释层，从SPDY的消息头中获取各个资源的HTTP头即可。

#######  SPDY的工作方式特征

- 利用一个TCP连接来传输不限个数的资源请求的读写数据流
- 根据资源的重要性，给每个数据流设置优先级
- 只对这些请求使用压缩技术，可以大大减少需要发送的字节数
- 当用户需要浏览某个网页，支持SPDY协议的服务器在发送网页内容时，可以尝试发送一些信息给浏览器，告诉后面可能需要哪些资源，浏览器可以提前知道并决定是否需要下载。更极端的情况是，服务器可以主动发送资源。

#### 4.3.6.4 使用QUIC协议

QUIC是一种新的网络传输协议，主要目标是改进UDP数据协议的能力。同SPDY建立在传输层之上不同，QUIC所要解决的问题就是传输层的传输效率，并提供了数据的加密。所以，SPDY可以在QUIC之上工作。



