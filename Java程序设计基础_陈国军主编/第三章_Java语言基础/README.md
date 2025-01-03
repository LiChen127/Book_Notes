# 第三章 Java语言基础

## 3.1 数据类型

Java语言中的数据类型:
  
1. 基本数据类型-> 整型，浮点型，逻辑型，字符型
2. 引用数据类型-> 类，数组，接口等

基本数据类型是由程序设计语言系统所定义、不可再分的数据类型。每种基本数据类型的数据所占内存的大小是固定的，与软硬件环境无关。基本数据类型在内存中存放的是数据值本身。引用数据类型在内存中存放的是指向该数据的地址，不是数据值本身，它往往由多个基本数据类型组成，因此，对引用数据类型的应用称为对象引用，引用数据类型也被称为复合数据类型，在有的程序设计语言中称为指针。

1. 整型: byte, short, int, long
2. 浮点型: float, double
3. 布尔型: boolean
4. 字符型: char

## 3.2 关键字与标识符

1. 关键字
2. 标识符

## 3.3 常量

```java
final int MAX = 10;
final float PI = 3.14f;
```

## 3.4 变量

```java
int i = 0;
float x = 3.14;
boolean truth = true;
char c = 'A';
```

## 3.5 数据类型转换

### 3.5.1 数值型不同类型数据的转换

分为自动类型转换和强制类型转换。
凡是把占用比特数较少的数据（简称较短的数据）转换成占用比特数较多的数据（简称较长的数据）​，都使用自动类型转换，即类型转换由编译系统自动完成，不需要程序做特别的说明。但如果把较长的数据转换成较短的数据时，就要使用强制类型转换，否则就会产生编译错误。

#### 自动类型转换

条件:

1. 转换前后的数据类型兼容
2. 转换后的比特数大于转换前的比特位
  
这种类型的转换方式也称为扩大转换（augmented conversion）​。

```java
public class App {
  public static void main(String[] args) {
    int a = 35;
    float b = 21.0f;
    System.out.println("a", a);
  }
}
```

#### 强制类型转换

## 3.6 由键盘输入数据

```java
import java.io;

public class class_name {
  public static void main(String[] args) throws IOException {
    String str; // 声明str为String类型的变量
    BufferedReader buf; // 声明buf为BufferedReader类的变量，该类在java.io类库中。
    buf = new BufferedReader(new InputStreamReader(System.in));

    str = buf.readLine(); 
  }
}

```


<!-- 第二种写法 -->

```java
import java.io;
public class class_name {
  public static void main(String[] args) throws IOException {
    String str; // 声明str为String类型的变量
    InputStreamReader inp;
    inp = new InputStreamReader(System.in);

    BufferedReader buf;
    buf = new BufferedReader(inp);

    str = buf.readLine();
  }
}
```

## 3.7 运算符与表达式

### 3.7.1 算术运算符

## 4 流程控制

```java
public class app {
  public static void main(String[] args) {
    int testScore = 86;
    char grade;
    if (testScore > 90) {
      grade = 'A';
    } else if (testScore < 90) {
      grade = 'C';
    }
  }
}
```

switch

```Java
public class app {
  public static void main(String[] args) throws Exception {
    int a = 100;
    int b = 6;
    char oper;
    System.out.println('请输入运算符: ');
    oper = (char)System.in.read();
    switch(oper) {
      case '+': 
        System.out.println('加号');
        break;
      case '-':
        System.out.println('减号');
        break;
      default:
        System.out.println('输入符号不正确!');
    }
  }
}
```

循环

```java
public class app {
  public static void main(String[] args) {
    final int MAX = 15;
    int i = 0, j = 1, k = 1;
    while(k <= MAX) {
      System.out.print(" " + i + " " + j);
      i = i + j;
      j = i + j;
      k = k + 2;
    }
    System.out.println();
  }
}
```

```java
public class app {
  public static void main(String[] args) {
    int i = 0;
    int target = 10;
    for (i = 1; i <= n; i++) {
      s += i;
    }
  }
}
```

## 第五章 数组与字符串

```java
public class ForeeachExample {
  public static void main(String[] args) {
    String[] fruits = {"Apple", "Banana", "Cherry"};
    for (String fruit : fruits) {
      System.out.println(fruits);
    }
  }
}
```

**字符串**

## 第六章 类与对象

#### 1. 类的一般结构

1. public: 公共类，可以被任何对象访问
2. abstract: 抽象类, 没有实现方法，需要子类提供方法的实现，不能创建该类的实例
3. final: 将一个类声明为最终类即非继承类
4. 缺省: 只有相同包中才能使用这样的类

#### 2. 成员变量

一个类的成员变量描述了该类的内部信息，一个成员变量可以是基本类型变量，也可以是对象、数组等其他引用型数据

1. public: 公共访问控制符，指定该变量为公共的，可以被任何对象的方法访问
2. private: 私有访问控制符，指定该变量只允许自己的类的方法访问，其他都不可以访问
3. protected: 保护访问控制符。
4. 缺省: 同一包
5. final: 最终
6. static: 所有的实例可以使用的变量
7. transient: 过渡修饰符。系统保留，无特别作用的临时变量
8. volatile: 易丢修饰符。同时可以被多个线程控制和修改

#### 3. 成员方法

1. public
2. private
3. protected
4. 缺省
5. final
6. static
7. abstract
8. synchronized
9. native

#### 4. 成员变量与局部变量的区别

由类和方法的定义可知，在类和方法中均可定义属于自己的变量。类中定义的变量是成员变量，而方法中定义的变量是局部变量。类的成员变量与方法中的局部变量是有一定区别的。

1. 成员变量是属于类的，而局部变量是在方法中定义的变量/方法的参数
2. 从变量在内存中的存储方式上看，成员变量是对象的一部分，而对象是存在于堆内存的，而局部变量是存在于栈内存的。
3. 从变量在内存中的生存时间上看，成员变量是对象的一部分，它随着对象的创建而存在，而局部变量随着方法的调用而产生，随着方法调用的结束而自动消失。
4. 成员变量如果没有被赋初值，则会自动以类型的默认值赋值（有一种情况例外，被final修饰但没有被static修饰的成员变量必须显式地赋值）​；而局部变量则不会自动赋值，必须显式地赋值后才能使用。

### 6.3 对象

#### 6.3.1 创建对象

```java
// Cylinder volu;
// volu = new Cylinder();

class Cylinder {
  double radius;
  int height;
  double pi = 3.14;
  double area() {
    return pi * radius * radius;
  }

  double volume() {
    return this.area() * height;
  }
}

public class App {
  public static void main(String[] args) {
    Cylinder volu;
    volu = new Cylinder();
    volu.radius = 1;
    volu.height=  1;

  }
}

```
### 6.4 参数的传递

#### 6.4.1 以变量为参数调用方法

```java
class Cylinder {
  double radius;
  int height;
  void setCylinder(double r, int h, double p) {
    pi = p;
    radius = r;
    height = h;
  }

  double area() {
    return pi * radius * radius;
  }

  double volume() {
    retrun area() * height;
  }

}

public class App {
  public static void main(String[] args) {
    Cylinder volu = new Cylinder;
    volu.setCylinder(1, 3, 2);
  }
}
```

## 第七章 Java语言类的特性

### 7.1 类的私有成员与公共成员

```java
class Cylinder {
  private double radius;
  private int height;
  private double pi = 3.14;
  double area() {
    return pi * radius * radius;
  } 

  double volume() {
    return area() * height;
  }

}

public class APP {
  public static void main(String[] args) {
    Cylinder volu = new Cylinder;
  }
}
```

### 构造方法

构造方法是一种特殊的方法，是在对象被创建时初始化对象成员的方法。构造方法的名称必须与类名完全相同。构造方法没有返回值，定义构造方法不能用void修饰
类的构造方法返回自身。

构造方法定义后，创建对象时就会自动调用它，因此构造方法不需要在程序中直接调用，而是在对象创建时自动调用并执行。

```java
class Cylinder {
  private double radius;
  private int height;
  private double pi = 3.14;
  public Cylinder(double r, int h) {
    radius = r;
    height = h;
  }
  double area() {
    return pi * radius * radius;
  }
}

public class App {
  public static void main(String[] args) {
    Cylinder volu = new Cylinder(3.1, 1);
  }
}
```

##### 从一个构造方法内调用另一个构造方法

```java
class Cy {
  private double radius;
  private int height;
  private double pi = 3.14;
  String color;
  public Cy() {
    this(2.5, 5, "红色");
  }
  public Cy(double r, int h, String str) {
    radius = r;
    height = h;
    color = str;
  }
}

```

#### 公共的构造方法与私有的构造方法

```java
class Cy {
  private double radiuis;
  private int height;
  private double pi = 3.14;
}
```

## 继承，抽象类，接口和枚举

### 类的继承

#### 子类的创建

```java
class Person {
  private String name;
  private int age;
  public Person() {
    System.out.println('调用了个人类的构造方法Person()');
  }
  public void setNameAge(String name, int age) {
    this.name = name;
    this.age = age;
  }
  public void show() {
    System.out.println("name" + name, "age" + age);
  }
}

class Student extends Person {
  private String department;
  public Student() {
    System.out.println('调用了学生类的构造方法Student()');
  }
  public void setDepartment(String dep) {
    department = dep;
  }
  public Student(String name, int age, String dep) {
    super(name, age);
    department = dep;
  }
}

public class App {
  public static void main(String[] args) {
    Student stu = new Student();
    stu.setNameAge("小三", 19);
    stu.show();
    stu.setDepartment('计算机');
  }
}

```

#### 在子类中访问父类的成员

```java
class Person {
  protected String name;
  protected int age;
  public Person() {};
  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }
  protected void show() {
    System.out.println(name, age);
  }
}

class Student extends Person {
  private String department;
  int age = 20;
  public Student(String xm, String dep) {
    name = xm;

  }
}
```

### 接口

```java
interface IShape {
  static final double PI = 3.14;
  abstract double getArea();
  abstract double getLength();
}

class Circle implements IShape {
  double radius;
  public Circle(double r) {
    radius = r;
  }
  public double getArea() {
    return PI * radius * radius;
  }
  public double getLength() {
    return 2 * PI * radius;
  }
}

```

### 枚举

```java
enum Direction {
  EAST,
  SOUTH,
  WEST,
  NORTH
};

public class App {
  public static void main(String[] args) {
    Direction dir = Direction.EAST;

  }
}
```

## 输入输出与文件处理

### Java语言的输入输出

#### 流的概念

**流(stream)**是指计算机各部件之间的数据流动。按照数据的传输方向，流可分为输入流与输出流。从流的内容上划分，流分为字节流和字符流。Java语言里流中的数据既可以是未经加工的原始二进制数据，也可以是经过一定编码处理后符合某种格式规定的特定数据，即流是由位（bits）组合或字符（characters）所构成的序列，如字符流序列、数字流序列等。用户可以通过流来读写数据，甚至可以通过流连接数据源，并可以将数据以字符或位组合的形式保存。

## 多线程

```java
class MyThread extends Thread {
  private String who;
  public MyThread(String str) {
    who = str;
  }
  public void run() {
    for (int i = 0; i < 5; i++) {
      try {
        sleep((int)(1000 * Math.random()));
      } catch(InterruptedException e) {

      }
    }
  }
}

public class App {
  public static void main(String[] args) {
    MyThread you = new MyThread('你');
    MyThread she = new MyThread('他');
    you.start();
    she.start();
  }
}
```

**Runnable接口创建线程**

```java
class MyThread implements Runnable {
  private String who;
  public MyThread(String str) {
    who = str;
  }
  public void run() {
    for (int i = 0; i < 5; i++) {
      try {
        Thread.sleep((int)(1000 * Math.random()));
      } catch {

      }
    }
  }
}
```


```java
class ThreadSale extends Thread {
  private int tickets = 10;
  public void run() {
    while(true) {
      if (tickets > 0) {
        System.out.println(this.getName());
      } else {
        Symstem.exit(0);
      }
    }
  }
}

public class App {
  public static void main(String[] args) {
    ThreadSale t1 = new ThreadSale();
    ThreadSale t2 = new ThreadSale();
    ThreadSale t3 = new ThreadSale();
    t1.start();
    t2.start();
    t3.start();
  }
}
```

```java
class MyBank {
  private static int sum = 2000;
  public synchronized static void take(int k) {
    int temp = sum;
    temp -= k;
    try {
      Thread.sleep((int)(1000 * Math.random()));
    } catch {

    }
    sum = temp;
  }
}

class Customer extends MyBank {
  public void run() {
    for (int i = 1; i < 5; i++) {
      MyBank.take(100);
    }
  }
}

public class App {
  public static void main(String[] args) {
    Customer c1 = new Customer();
    Customer c2 = new Customer();
    c1.start();
    c2.start();
  }
}
```

### 线程之间的通信

```java
public class App {
  public static void main(String[] args) {
    Tickets t = new Tickets(10);
    new Producer(t).start();
    new Consumer(t).start();
  }
}

class Tickets {
  protected int size;
  int number = 0;
  boolean available = false;
  public Tickets(int size) {
    this.size = size;
  }
  public synchronized void put() {
    if (available) {
      try {
        wait();
      } catch (Exception e){
      }
      System.out.println("")；
      available = true;
      notify(); // 唤醒售票线程开始售票
    }
  }
  public synchronized void sell() {
    if (!available) {
      try {
        wait();
      } catch {

      }
    }
    available = false;
    notify();
    if (number == size) {
      number = size + 1;
    }
  }
}

class Producer extends Thread {
  Tickets t = null;
  public Producer(Tickets t) {
    this.t = t;
  }
  public void run() {
    while(t.number < t.size) {
      t.put();
    }
  }
}

class Consumer extends Thread {
  Tickets t = null;
  public Consumer(Tickets t) {
    this.t = t;
  }
  public void run() {
    while(t.number <= t.size) {
      t.sell();
    }
  }
}
```

## 泛型与容器类

```java
public class App {
  private T obj;
  public T getObj() {
    return obj;
  }
  public void setObj(T obj) {
    this.obj = obj;
  }
  public static void main(String[] args) {
    App<String> name = new App<string>();
    App<Integer> age = new App<Integer>();
    name.setObj("cc");
    age.setObj(12);
  }
}
```

```java
public class App {
  public static void main(String[] args) {
    Integer[] num = [1, 2, 3, 4, 5];
    String[] str = {'红', '绿', '蓝'};
    App.display(num);
    App.display(str);
  }
  public static <T> void display(T[] list) {
    for (int i = 0; i < list.length; i++) {
      System.out.println("list[i]", list[i]);
    }
  }
}
```

```java
class GenerateType<T extends Number> {
  T obj;
  public GenerateType(T obj) {
    this.obj = obj;
  }
  public T getObj() {
    return obj;
  }
}

public class App {
  public static void main(String[] args) {
    GenerateType<Integer> num = new GenerateType<Integer>(5);
  }
}
```

### 注解

```java
public class App {
  public String name;
  public int age;
  @Deprecated
  public void show(String name) {
    System.out.println(name);
  }
  @Override
  public String toString() {
    return 'name' + name;
  }
}
```

### 元注解

元注解也称元数据注解，是对注解进行标注的注解

### 自定义注解

```java
@interface info {
  String author() default '张三丰';
}
```

### 反射

Java的反射（reflection）机制是指在程序的运行状态中，可以构造任意一个类的对象，可以了解任意一个对象所属的类，可以了解任意一个类的成员变量和方法，可以调用任意一个对象的属性和方法。这种动态获取程序信息以及动态调用对象的功能就是Java语言的反射机制，所以反射被视为动态语言的关键。

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Parameter;

class Person {
  private String name;
  private int age;
  public Person(String name ,int age) {
    this.name = name;
    this.age = age;
  }
  public void info(String prof, int score) {
    System.out.println(prof, score);
  }
  @Override
  public String toString() {
    return '姓名' + name + '年龄' + age;
  }
}

public class App {
  public static void main(String[] args) {
    Class<Person> pc = Person.class;
    try {
      Constructor con = pc.getConstructor(String.class, int.class);
      Class[] pt = con.getParamterTypes();
    } catch {

    }
  }
}
```

```java
a.outShape(() -> {
  System.out.println("LAMADA")
})
```

```java
@FunctionalInterface // 说明下面的接口是函数式接口
interface IntFun {
  double dis(int n);
}

public class App {
  public static void main(String[] args) {
    IntFun fun = (i) -> { return 2 * i; }
    double m = fun.dis(3);
  }
}


```

## GUI

