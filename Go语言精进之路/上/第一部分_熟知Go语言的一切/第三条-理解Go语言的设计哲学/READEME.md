# 3.1 追求简单, 少即是多

简单是一种伟大的美德，但我们需要更艰苦地努力才能实现它，并需要经过一个教育的过程才能去欣赏和领会它。但糟糕的是：复杂的东西似乎更有市场。简单是一种伟大的美德，但我们需要更艰苦地努力才能实现它，并需要经过一个教育的过程才能去欣赏和领会它。但糟糕的是：复杂的东西似乎更有市场。

--Edsger Dijkstra 

Go的设计者们在语言设计之初就拒绝走语言特性融合的道路，而选择了“做减法”​，选择了“简单”​，他们把复杂性留给了语言自身的设计和实现，留给了Go核心开发组自己，而将简单、易用和清晰留给了广大Gopher。

Go设计者推崇最小方式思维，即一件事情仅有一种方式或数量尽可能少的方式去完成

正如Go语言之父Rob Pike所说：​“Go语言实际上是复杂的，但只是让大家感觉很简单

此外，Go的简单哲学还体现在Go 1兼容性的提出。对于面对工程问题解决的开发人员来说，Go 1大大降低了工程层面语言版本升级所带来的消耗，让Go的工程实践变得格外简单。

# 3.2 偏好组合，正交解耦

当我们有必要采用另一种方式处理数据时，我们应该有一些耦合程序的方式，就像花园里将浇水的软管通过预置的螺丝扣拧入另一段那样，这也是Unix IO采用的方式。

**Go语言遵从的设计哲学也是组合**

在语言设计层面，Go提供了正交的语法元素供后续组合使用，包括：

- Go语言没有类型体系，类型之间是独立的，没有子类型的概念;
- 每个类型都可以有自己的方法集合，类型定义与方法实现是正交独立的;
- 接口(interface)与其实现之间隐式关联;
- 报之间相对独立，没有子包的概念

Go语言为我们呈现了这样一幅图景：一座座没有关联的“孤岛”​，但每个岛内又都很精彩。现在摆在面前的工作就是以最适当的方式在这些孤岛之间建立关联（耦合）​，形成一个整体。Go采用了组合的方式，也是唯一的方式。

Go语言提供的最为直观的组合的语法元素是类型嵌入

通过类型嵌入，我们可以将已经实现的功能嵌入新类型中，以快速满足新类型的功能需求。这种方式有些类似经典OO语言中的继承机制，但在原理上与其完全不同，这是一种Go设计者们精心设计的语法糖。被嵌入的类型和新类型之间没有任何关系，甚至相互完全不知道对方的存在，更没有经典OO语言中的那种父类、子类的关系以及向上、向下转型（type casting）​。在通过新类型实例调用方法时，方法的匹配取决于方法名字，而不是类型。

interface是Go语言中真正的“魔法”​，是Go语言的一个创新设计，它只是方法集合，且与实现者之间的关系是隐式的，它让程序各个部分之间的耦合降至最低，同时是连接程序各个部分的“纽带”​。隐式的interface实现会不经意间满足依赖抽象、里氏替换、接口隔离等设计原则，这在其他语言中是需要很刻意的设计谋划才能实现的，但在Go interface看来，一切却是自然而然的。

综上，组合原则的应用塑造了Go程序的骨架结构。类型嵌入为类型提供垂直扩展能力，interface是水平组合的关键，它好比程序肌体上的“关节”​，给予连接“关节”的两个部分各自“自由活动”的能力，而整体上又实现了某种功能。组合也让遵循简单原则的Go语言在表现力上丝毫不逊色于复杂的主流编程语言。

# 3.3 原生并发，轻量高效

**并发是有关结构的，而并行是有关执行的**

Go的设计者敏锐地把握了CPU向多核方向发展的这一趋势，在决定不再使用C++而去创建一门新语言的时候，果断将面向多核、原生内置并发支持作为新语言的设计原则之一。

Go原生支持并发的设计哲学在于以下几点:

1. Go语言采用轻量级的协程并发模型，使得Go应用在面向多核硬件时具有可扩展性
   提到并发执行与调度，我们首先想到的就是操作系统对进程、线程的调度。操作系统调度器会将系统中的多个线程按照一定算法调度到物理CPU上运行。传统编程语言（如C、C++等）的并发实现实际上就是基于操作系统调度的，即程序负责创建线程（一般通过pthread等函数库调用实现）​，操作系统负责调度。这种传统支持并发的方式主要有两大不足：复杂和难于扩展。
   Go果断放弃了传统的基于操作系统线程的并发模型，而采用了用户层轻量级线程或者说是类协程（coroutine），Go将之称为goroutine。goroutine占用的资源非常少，Go运行时默认为每个goroutine分配的栈空间仅2KB。goroutine调度的切换也不用陷入（trap）操作系统内核层完成，代价很低。因此，在一个Go程序中可以创建成千上万个并发的goroutine。所有的Go代码都在goroutine中执行，哪怕是Go的运行时代码也不例外。
   不过，一个Go程序对于操作系统来说只是一个用户层程序。操作系统的眼中只有线程，它甚至不知道goroutine的存在。goroutine的调度全靠Go自己完成，实现Go程序内goroutine之间公平地竞争CPU资源的任务就落到了Go运行时头上。而将这些goroutine按照一定算法放到CPU上执行的程序就称为goroutine调度器（goroutine scheduler）
2. Go语言为开发者提供的支持并发的语法元素和机制
3. 并发原则对Go开发者在程序结构设计层面的影响: 由于goroutine的开销很小（相对线程）​，Go官方鼓励大家使用goroutine来充分利用多核资源。但并不是有了goroutine就一定能充分利用多核资源，或者说即便使用Go也不一定能写出好的并发程序。

## 并发(Concurrency)和并行(Parallelism)的区别

Rob Pike认为:

并发是有关结构的，它是一种将一个程序分解成多个小片段并且每个小片段都可以独立执行的程序设计方法;并发程序的小片段之间一般存在通信联系并且通过通信相互协作。
并行是有关执行的，它表示同时进行一些计算任务。

**并发程序的结构设计不要局限于在单核情况下处理能力的高低，而要以在多核情况下充分提升多核利用率、获得性能的自然提升为最终目的。**

# 面向工程, **自带电池**

Go设计者将所有工程问题浓缩为一个词：scale

Go的设计目标就是帮助开发者更容易、更高效地管理两类规模:

- 生产规模: 用Go构建的软件系统的并发规模，比如这类系统并发关注点的数量、处理数据的量级、同时并发与之交互的服务的数量等。
- 开发规模: 包括开发团队的代码库的大小，参与开发、相互协作的工程师的人数等。

## Go如何解决工程领域规模化带来的问题?

### 语言

语法是编程语言的用户接口，它直接影响开发人员对于一门语言的使用体验。Go语言是一门简单的语言，简单意味着可读性好，容易理解，容易上手，容易修复错误，节省开发者时间，提升开发者间的沟通效率。但作为面向工程的编程语言，光有简单的设计哲学还不够，每个语言设计细节还都要经过“工程规模化”的考验和打磨，需要在细节上进行充分的思考和讨论。

### 标准库

Go被称为“自带电池”​（battery-included）的编程语言。​“自带电池”原指购买了电子设备后，在包装盒中包含了电池，电子设备可以开箱即用，无须再单独购买电池。如果说一门编程语言“自带电池”​，则说明这门语言标准库功能丰富，多数功能无须依赖第三方包或库，Go语言恰是这类编程语言。由于诞生年代较晚，且目标较为明确，Go在标准库中提供了各类高质量且性能优良的功能包，其中的net/http、crypto/xx、encoding/xx等包充分迎合了云原生时代关于API/RPC Web服务的构建需求。

### 工具链

开发人员在做工程的过程中需要使用工具。而Go语言提供了十分全面、贴心的编程语言官方工具链，涵盖了编译、编辑、依赖获取、调试、测试、文档、性能剖析等的方方面面。

gofmt统一了Go语言的编码风格，在其他语言开发者还在为代码风格争论不休的时候，Go开发者可以更加专注于领域业务。同时，相同的代码风格让以往困扰开发者的代码阅读、理解和评审工作变得容易了很多，至少Go开发者再也不会有那种因代码风格的不同而产生的陌生感。

