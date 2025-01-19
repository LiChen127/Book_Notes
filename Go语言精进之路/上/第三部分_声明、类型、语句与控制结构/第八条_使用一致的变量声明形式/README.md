# 使用 一致的变量声明形式

Go语言沿袭了静态编译型语言的传统：使用变量之前需要先进行变量的声明。

```go
var a int 32
var s string = "hello"
var i = 13
n := 17
var (
  crlf = []byte("\r\n")
  colonSpace = []byte[": "]
)
```

Go语言有两类变量:

1. 包级变量(package variable): 在package级别可见的变量。如果是导出变量，则包级变量也可以被视为全局变量
2. 局部变量(local variable): 函数或方法体内声明的变量，仅在函数或方法体内可见

## 包级变量的声明形式

包级变量只能使用带有var关键字的变量声明形式，但在形式细节上仍有一定的灵活度。我们从声明变量时是否延迟初始化这个角度对包级变量进行一次分类。

### 声明并同时初始化

```go
var EOF = errors.New('EOF')

var a int32 = 17
var f float32 = 3.14

var a1 = int32(17)
var f = float32(3.14)
```

### 声明但延迟初始化

```go
var a int 32
```

### 声明聚类与就近原则

```go
var (
  bufioReaderPool sync.Pool
  bufioWriter2kPool sync.Pool
)
```

变量声明最佳实践中还有一条：就近原则，即尽可能在靠近第一次使用变量的位置声明该变量。就近原则实际上是变量的作用域最小化的一种实现手段。

## 局部变量的声明方式

### 对于延迟初始化的局部变量声明，采用带有var关键字的声明形式

```go
func (r *byteReplacer) Replace(s string) string {
  var buf []byte
}
```

### 对于声明且显式初始化的局部变量，建议使用短变量声明形式

短变量声明形式是局部变量最常用的声明形式，它遍布Go标准库代码。

```go
a := 17
f := 3.14
// 对于不接受默认类型的变量，依然可以使用短变量声明形式，只是要在右侧进行显式转型
c := int32(17)
```

### 尽量在分支控制时应用短变量声明形式

