# 第十四条_了解map实现原理并高效使用

## 什么是map?

map是Go语言提供的一种抽象数据类型，它用于存储无序的键值对。

map对value的类型没有限制，但是对key的类型有严格要求: key的类型应该严格定义了作为"=="和"!="操作符的含义。

函数、map、切片不可以作为map的key类型

map类型不支持“零值可用”​，未显式赋初值的map类型变量的零值为nil。对处于零值状态的map变量进行操作将会导致运行时panic

```go
var m map[string]int // m = nil
m["key"] = 123 // panic: assignment to entry in nil map
```

我们必须对map类型变量进行显式初始化后才可以使用它。

和切片一样，创建map类型变量有两种方式:

1. 使用复合字面量
2. 使用make预声明的内置函数

```go
var statusText = map[int]string {
  StatusOk: "OK",
  StatusNotFound: "Not Found",
  StatusInternalServerError: "Internal Server Error",
}
```

```go
icookies := make(map[string][]*cookie)
```

和切片一样，map也是引用类型，将map类型变量作为函数参数传入不会有很大的性能损耗，并且在函数内部对map变量的修改在函数外部也是可见的

## map的基本操作

### 插入数据

```go
m := make(map[K]V)
m[key1] = value1
m[key2] = value2
m[key3] = value3
```

### 获取数据个数

和切片一样，map也可以通过内置函数len获取当前已经存储的数据个数

### 查找和数据读取

```go
_, ok := m["key"]
if !ok {
  fmt.Println("key not found")
}
```

总是使用"comma ok"语法检查map中是否存在某个key

### 删除数据

```go
delete(m, "key")
```

### 遍历map

```go
func main() {
  m := map[int] int {
    1: 1,
    2: 2,
    3: 3,
  }
  for k, v := range m {
    fmt.Println(k, v)
  }
}
```

给我们的表象是迭代器按照map中元素的插入次序逐一遍历

```go
func doIteration(m map[int]int) {
  for k, v := range m {
    fmt.Println(k, v)
  }
}

func main() {
  m := map[int] int {
    1: 1,
    2: 2,
    3: 3,
  }
  for i: =; i < 3; i++ {
    doIteration(m)
  }
}
```

我们看到对同一map做多次遍历，遍历的元素次序并不相同。这是因为Go运行时在初始化map迭代器时对起始位置做了随机处理。因此千万不要依赖遍历map所得到的元素次序。

## map的内部实现

Go运行时使用一张哈希表来实现抽象的map类型。
在编译阶段，Go编译器会将语法层面的map操作重写为对运行时库函数的调用。

和切片的运行时表示相比，map在运行时的表示显然要复杂得多

### 初始状态

与语法层面map类型变量一一对应的是runtime.hmap类型的实例
hmap是map类型的header,可以理解map类型的描述符，它存储了后续map类型操作所需要的所有信息

- count: 当前map中的元素个数;对map类型变量运用len内置函数式，len函数返回的就是count这个值
- flags: 当前map的标志位，用于表示map的只读状态、map是否被并发写操作修改等(iterator, oldIterator, hashWriting, sameSizeGrow)
- B: B的值式bucket数量的以2为底的对数，即2^B=bucket数量
- noverflow: 当前map中溢出bucket的数量
- hash0: 当前map的哈希种子
- buckets: 指向bucket数组的指针
- oldbuckets: 在map扩容阶段指向前一个bucket数组的指针
- nevacuate: 在map扩容阶段充当扩容进度计数器。所有下标号小于nevacuate的bucket都已经完成了数据排空和迁移操作。
- extra: 可选字段。如果有overflow bucket存在，且key、value都因不包含指针而被内联（inline）的情况下，该字段将存储所有指向overflow bucket的指针，保证overflow bucket是始终可用的（不被垃圾回收掉）​。

真正用来存储键值对数据的是bucket, 每个bucket中存储的是Hash值低bit位数值相同的元素。

每个bucket由三部分组成:

1. tophash: 当向map插入一条数据或从map按key查询数据的时候，运行时会使用哈希函数对key做哈希运算并获得一个hashcode。这个hashcode非常关键，运行时将hashcode“一分为二”地看待，其中低位区的值用于选定bucket，高位区的值用于在某个bucket中确定key的位置
每个bucket中的tophash区域用于快速定位key，空间换时间
2. key存储区域
tophash区域下面是一块连续的内存区域，存储的是该bucket承载的所有key数据。
运行时在分配bucket时需要知道key的大小。当我们声明一个map类型变量时，比如var m map[string]int，Go运行时就会为该变量对应的特定map类型生成一个runtime.maptype实例（如存在，则复用）​：
```go
type maptype struct {
  typ _type
  key *_type
  elem *_type
  bucket *_type // 表示hash bucket的内部类型
  keysize uint8 // key的大小
  elemsize uint8 // value的大小
  bucketsize uint16 // bucket的大小
  flags uint32 // 标志位
}
```

3. value存储区域
key存储区域下方是另一块连续的内存区域，该区域存储的是key对应的value。和key一样，该区域的创建也得到了maptype中信息的帮助。Go运行时采用了将key和value分开存储而不是采用一个kv接着一个kv的kv紧邻方式存储，这带来的是算法上的复杂性，但却减少了因内存对齐带来的内存浪费。
如果key或value的数据长度大于一定数值，那么运行时不会在bucket中直接存储数据，而是会存储key或value数据的指针。

### map扩容

map会对底层使用的内存进行自动内存管理。

因此，在使用过程中，在插入元素个数超出一定数值后，map势必存在自动扩容的问题（扩充bucket的数量）​，并重新在bucket间均衡分配数据。

Go运行时的map实现中引入了一个LoadFactor(负载因子)，
当count > LoadFactor * 2^B或overflow bucket过多时，运行时会对map进行扩容。

如果是因为overflow bucket过多导致的“扩容”​，实际上运行时会新建一个和现有规模一样的bucket数组，然后在进行assign和delete操作时进行排空和迁移；如果是因为当前数据数量超出LoadFactor指定的水位的情况，那么运行时会建立一个两倍于现有规模的bucket数组，但真正的排空和迁移工作也是在进行assign和delete操作时逐步进行的。原bucket数组会挂在hmap的oldbuckets指针下面，直到原buckets数组中所有数据都迁移到新数组，原buckets数组才会被释放。结合图14-4来理解这个过

### map与并发

充当map描述符角色的hmap实例自身是有状态的(hmap.flags)且对状态的读写是没有并发保护的，因此map实例不是并发写安全的、不支持并发读写。
如果对map实例进行并发写操作，那么运行时会抛出panic。

fatal error: concurrent map iteration and map write

Go 1.9版本引入了支持并发写安全的sync.Map类型，可以用来在并发读写的场景下替换调map。

另外考虑到map可以自动扩容，map中数据元素的value位置可能在这一过程中发生变化，因此Go不允许获取map中value的地址，这个约束是在编译期间就生效的。

## 尽量使用cap参数创建map

## 总结

1. 不要依赖map遍历的元素次序;
2. map不是线程安全的，不支持并发写;
3. 不要尝试获取map中元素(value)的地址;
4. 尽量使用cap参数创建map, 以减少扩容带来的性能损耗;

