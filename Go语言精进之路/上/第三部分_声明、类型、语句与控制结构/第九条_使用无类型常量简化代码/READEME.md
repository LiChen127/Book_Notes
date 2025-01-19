# 使用无类型常量简化代码

## Go常量溯源

Go语言是站在C语言等编程语言的肩膀之上诞生的，它原生提供常量定义的关键字const。Go语言中的const整合了C语言中宏定义常量、const只读变量和枚举常量三种形式，并消除了每种形式的不足，使得Go常量成为类型安全且对编译器优化友好的语法元素。

```go
const (
  SeekStart = 0
  SeekCurrent = 1
  SeekEnd = 2
)
```

## 有类型常量带来的烦恼

Go是对类型安全要求十分严格的编程语言。Go要求，两个类型即便拥有相同的底层类型（underlying type）​，也仍然是不同的数据类型，不可以被相互比较或混在一个表达式中进行运算

我们看到，Go在处理不同类型的变量间的运算时不支持隐式的类型转换。Go的设计者认为，隐式转换带来的便利性不足以抵消其带来的诸多问题[1]。

```go
type myInt int

func main() {
  var a int = 5
  var b myInt = 6
  fmt.Println(a + b) // 报错
}
```

```go
type myInt int

func main() {
  var a int = 5
  var b myInt = 6
  fmt.Println(a + int(b))
}
```

## 无类型常量消除烦恼，简化代码

Go的无类型常量恰恰就拥有像字面值这样的特性，该特性使得无类型常量在参与变量赋值和计算过程时无须显式类型转换，从而达到简化代码的目的

