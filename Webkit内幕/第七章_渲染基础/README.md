# 第七章 渲染基础

## 7.1 RenderObject树

### 7.1.1 RenderObject基础类

在DOM树构建完成之后，WebKit所要做的事情就是为DOM树节点构建RenderObject树。那么什么是RenderObject呢？它的作用是什么呢？

在DOM树中，某些节点是用户不可见的。(比如meta， head)

对于这些"可视节点"，WebKit需要将它们的内容绘制到最终的网页结果中，所以WebKit会为它们创建相应的RenderObject对象。

一个RenderObject对象保存了为绘制DOM节点所需要的各种信息，例如样式布局信息，经过WebKit的处理之后，RenderObject对象知道如何绘制自己。
这些RenderObject对象同DOM的节点对象类似，它们也构成一棵树，在这里我们称之为**RenderObject树**。
RenderObject树是基于DOM树建立起来的一棵新树，是为了布局计算和渲染等机制而构建的一种新的内部表示。RenderObject树节点和DOM树节点不是一一对应关系

哪些情况下为一个DOM节点建立新的RenderObject对象?

1. DOM树的document节点
2. DOM树中的可视节点
3. 某些情况下WebKit需要建立匿名的RenderObject节点, 该节点不对应于DOM树种的任何节点
