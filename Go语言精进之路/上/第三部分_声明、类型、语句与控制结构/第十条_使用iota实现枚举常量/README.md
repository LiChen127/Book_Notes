# 第十条

iota是Go语言的一个预定义标识符，它表示的是const声明块（包括单行声明）中每个常量所处位置在块中的偏移值（从零开始）​。同时，每一行中的iota自身也是一个无类型常量，可以像无类型常量那样自动参与不同类型的求值过程，而无须对其进行显式类型转换操作。

```go
const (
  mutexLocked = 1 << iota
  mutexWoken
  mutexStarvinf
  mutexWaiterShift = iota
  starvationThresholdNs = le6
)

const (
  Apple, Banana = iota, iota + 10
  Strawberry, Grape
  Pear, Watermelon
)
```

iota的加入让Go在枚举常量定义的能力上大大增强

1. iota预定义标识符能够以更为灵活的形式为枚举常量赋初值
2. Go的枚举常量不限于整型值，也可以定义浮点型(归功于Go无类型常量)
3. iota使得维护枚举常量列表更容易
4. 使用有类型枚举常量保证类型安全