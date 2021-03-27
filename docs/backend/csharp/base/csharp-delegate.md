## C#委托与事件

---

参考：[C# 中的委托和事件](https://www.cnblogs.com/JimmyZhang/archive/2007/09/23/903360.html)

参考：[不惧面试：委托](https://www.cnblogs.com/jackson0714/p/5111347.html)

---

就像文中说的一样

> 委托 和 事件在 .Net Framework中的应用非常广泛，然而，较好地理解委托和事件对很多接触C#时间不长的人来说并不容易。它们就像是一道槛儿，过了这个槛的人，觉得真是太容易了，而没有过去的人每次见到委托和事件就觉得心里别（biè）得慌，混身不自在。

### 符合 .Net Framework 的规范的事件和委托

我们先搞懂 .Net Framework的编码规范：

- 委托类型的名称都应该以`EventHandler`结束。
- 委托的原型定义：有一个`void`返回值，并接受两个输入参数：一个`Object` 类型，一个 `EventArgs`类型(或继承自`EventArgs`)。
- 事件的命名为 委托去掉 `EventHandler`之后剩余的部分。
- 继承自`EventArgs`的类型应该以`EventArgs`结尾。
- 再做一下说明：
  1. 委托声明原型中的`Object`类型的参数代表了`Subject`，也就是监视对象，在本例中是`Heater`(热水器)。回调函数(比如`Alarm`的`MakeAlert`)可以通过它访问触发事件的对象(`Heater`)。
  2. `EventArgs`对象包含了`Observer`所感兴趣的数据，在本例中是`temperature`。

```csharp
using System;
using System.Collections.Generic;
using System.Text;

namespace Delegate {
    // 热水器
    public class Heater {
        private int temperature;
        public string type = "RealFire 001";       // 添加型号作为演示
        public string area = "China Xian";         // 添加产地作为演示
        //声明委托
        public delegate void BoiledEventHandler(Object sender, BoiledEventArgs e);
        public event BoiledEventHandler Boiled; //声明事件

        // 定义BoiledEventArgs类，传递给Observer所感兴趣的信息
        public class BoiledEventArgs : EventArgs {
            public readonly int temperature;
            public BoiledEventArgs(int temperature) {
                this.temperature = temperature;
            }
        }

        // 可以供继承自 Heater 的类重写，以便继承类拒绝其他对象对它的监视
        protected virtual void OnBoiled(BoiledEventArgs e) {
            if (Boiled != null) { // 如果有对象注册
                Boiled(this, e);  // 调用所有注册对象的方法
            }
        }

        // 烧水。
        public void BoilWater() {
            for (int i = 0; i <= 100; i++) {
                temperature = i;
                if (temperature > 95) {
                    //建立BoiledEventArgs 对象。
                    BoiledEventArgs e = new BoiledEventArgs(temperature);
                    OnBoiled(e);  // 调用 OnBolied方法
                }
            }
        }
    }

    // 警报器
    public class Alarm {
        public void MakeAlert(Object sender, Heater.BoiledEventArgs e) {
            Heater heater = (Heater)sender;     //这里是不是很熟悉呢？
            //访问 sender 中的公共字段
            Console.WriteLine("Alarm：{0} - {1}: ", heater.area, heater.type);
            Console.WriteLine("Alarm: 嘀嘀嘀，水已经 {0} 度了：", e.temperature);
            Console.WriteLine();
        }
    }

    // 显示器
    public class Display {
        public static void ShowMsg(Object sender, Heater.BoiledEventArgs e) {   //静态方法
            Heater heater = (Heater)sender;
            Console.WriteLine("Display：{0} - {1}: ", heater.area, heater.type);
            Console.WriteLine("Display：水快烧开了，当前温度：{0}度。", e.temperature);
            Console.WriteLine();
        }
    }

    class Program {
        static void Main() {
            Heater heater = new Heater();
            Alarm alarm = new Alarm();

            heater.Boiled += alarm.MakeAlert;   //注册方法
            heater.Boiled += (new Alarm()).MakeAlert;      //给匿名对象注册方法
            heater.Boiled += new Heater.BoiledEventHandler(alarm.MakeAlert);    //也可以这么注册
            heater.Boiled += Display.ShowMsg;       //注册静态方法

            heater.BoilWater();   //烧水，会自动调用注册过对象的方法
        }
    }
}

//输出为：
//Alarm：China Xian - RealFire 001:
//Alarm: 嘀嘀嘀，水已经 96 度了：
//Alarm：China Xian - RealFire 001:
//Alarm: 嘀嘀嘀，水已经 96 度了：
//Alarm：China Xian - RealFire 001:
//Alarm: 嘀嘀嘀，水已经 96 度了：
//Display：China Xian - RealFire 001:
//Display：水快烧开了，当前温度：96度。
```

### 为什么使用事件，而不是委托

**好的例子**

```csharp

class Program
{
    static void Main(string[] args)
    {
        // 1. 符合规范，委托不对外公开，而是使用事件来注册
        Publisher pub = new Publisher();
        Subscriber sub = new Subscriber();
        pub.NumberChanged += sub.OnNumberChanged;
        pub.ChangedNum();
    }
}

public delegate void NumberChangedEventHandler(object sender, NumberChangedEventArgs e);

/// <summary>
/// 发布者
/// </summary>
public class Publisher
{
    public event NumberChangedEventHandler NumberChanged;
    private int Num = 100;
    public void ChangedNum()
    {
        Num++;
        NumberChangedEventArgs e = new NumberChangedEventArgs(Num);
        NumberChanged?.Invoke(this, e);
    }
}

public class NumberChangedEventArgs : EventArgs
{
    public int Num;
    public NumberChangedEventArgs(int num)
    {
        this.Num = num;
    }
}
/// <summary>
/// 订阅者
/// </summary>
public class Subscriber
{
    //符合规范
    public void OnNumberChanged(object sender, NumberChangedEventArgs e)
    {
        Console.WriteLine($"The number changed to {e.Num}");
    }  
}
```

**坏的例子**

```csharp
class Program
{
    static void Main(string[] args)
    {
        // 2. 不符合规范，委托对外部公开，客户端（Main方法）也能随意调用委托
        Publisher pub = new Publisher();
        Subscriber sub = new Subscriber();
        pub.NumberChanged = new NumberChangedEventHandler(sub.ChangedNumber);
        // pub.ChangedNum();

        pub.NumberChanged(pub.Num);//客户端随意调用，不符合封装规范
    }
}
public delegate void NumberChangedEventHandler(int num);	//定义委托

/// <summary>
/// 发布者
/// </summary>
public class Publisher
{
    // public event NumberChangedEventHandler NumberChanged;

    public NumberChangedEventHandler NumberChanged;	//声明一个委托
    public int Num = 100;

    public void ChangedNum()
    {
        Num++;
        NumberChanged?.Invoke(Num);	//委托调用
    }
} 

/// <summary>
/// 订阅者
/// </summary>
public class Subscriber
{
    //不符合规范
    public void ChangedNumber(int num)
    {
        Console.WriteLine($"The number changed to {num}");
    }
}

```



### 一些注意：

+ 委托其实就是一个类`Class`，在编译的时候，委托就会编译成类，所以**任何声明类的地方都可以声明委托**

+ 用`+=`、`-=`、可以方便的对委托进行多次方法绑定，绑定的方法将依次调用，不过使用前，需要对委托用`=`进行赋值

+ 事件其实就是对一个声明了的委托进行的封装，并且编译出来是私有成员

  事件为什么是私有的：对调用来说，私有的更安全，更符合规范

  在设计模式观察者模式中，**事件应由事件发布者触发，而不是客户端触发**

  如果是委托，则客户端也能访问到相应变量

+ **NOTE：**这里还有一个约定俗称的规定，就是订阅事件的方法的命名，通常为“On事件名”，比如这里的`OnNumberChanged`。

+ 为什么委托大多返回`void`?
  + 委托可以提供多个订阅注册，若有返回值，结果就是后面返回值将前面返回覆盖，实际只获得了最后一个返回值
  + 订阅者、发布者是松耦合的，发布者不关心谁订阅了它，所以一般是不用返回值的