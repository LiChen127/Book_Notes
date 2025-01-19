# 尽量定义零值可用的类型

## Go类型的零值

Go的每个原生类型都有默认值, 这个默认值就是这个类型的零值

Go规范定义的内置原生类型的默认值(零值):

- 所有整型类型: 0
- 浮点类型: 0.0
- 布尔类型: false
- 字符串类型: ""
- 指针、interface、切片、channel、map、function: nil

另外，Go的零值初始是**递归的**，即数组、结构体等类型的零值初始化就是对其组成元素逐一进行零值初始化。

## 零值可用

```go
// 关于切片
var zeroSlice []int
zeroSlice = append(zeroSlice, 1)
zeroSlice = append(zeroSlice, 2)
zeroSlice = append(zeroSlice, 3)
fmt.Println(zeroSlice) // [1, 2, 3]
```

我们声明了一个[​]int类型的切片zeroSlice，但并没有对其进行显式初始化，这样zeroSlice这个变量就被Go编译器置为零值nil。按传统的思维，对于值为nil的变量，我们要先为其赋上合理的值后才能使用。但由于Go中的切片类型具备零值可用的特性，我们可以直接对其进行append操作，而不会出现引用nil的错误。

```go
// nil指针调用方法
func main() {
  var p *net.TCPAddr
  fmt.Println(p) // <nil>
}
```


