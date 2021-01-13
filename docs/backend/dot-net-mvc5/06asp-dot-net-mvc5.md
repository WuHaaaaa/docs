---
title: 路由概念，底层实现
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---

## 前言

> 本章介绍路由特性，以及路由概念，底层实现等，需要好好看看，本章对应书中第九章

<!-- more -->

## 正文

高质量`URL`应该满足以下几点要求：

+ 域名便于记忆、拼写
+ 简短
+ 便于输入
+ 可以反映出站点结构
+ “可破解的”，用户通过移除`URL`尾部，可以进一步达到更高层次的信息体系结构
+ 持久、不能改变

## 路由方法

### 定义特性路由

启用特性路由，`~/App_Start/RouteConfig.cs`

```CSharp
public static void RegisterRoutes(RouteCollection routes)
{
    //注释掉之前的，我们开始使用特性路由
    //routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

    //routes.MapRoute(
    //    name: "Default",
    //    url: "{controller}/{action}/{id}",
    //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
    //);
	
    routes.MapMvcAttributeRoutes();
}
```

### 最简单的特性路由

```CSharp
public class HomeController : Controller
{
    public ActionResult Index()
    {
        return View();
    }
	//当使用特性路由后，其他未定义的路由都将不能使用
    //这个对应的url：localhost:4033/about
    [Route("about")]
    public ActionResult About()
    {
        ViewBag.Message = "Your application description page.";

        return View();
    }

    public ActionResult Contact()
    {
        ViewBag.Message = "Your contact page.";

        return View();
    }
}
```

### 使用多个特性路由

> **传入路由特性的字符串叫模板，它就是一个模式匹配规则。决定了这个路由是否适用传入的请求。只有当`URL`路径具有完全相同的字符串时，路由才会与之匹配。**

这样的好处是我们可以通过定义的多个路由访问指定的`URL`

```CSharp
[Route("")] //localhost:1234
[Route("home")] //localhost:1234/home
[Route("home/index")] //localhost:1234/home/index
public ActionResult Index()
{
    return View();
}
```

### 使用动态的特性路由

> **当特性路由匹配并运行操作方法时，模型绑定会使路由的路由参数为同名的方法参数填充值**

上面的路由是静态的，如果使用动态的，例如：在`URL`中包含记录的`ID`，则需要添加路由参数

```CSharp
//http://localhost:3150/contract/12
[Route("contract/{id}")]
public ActionResult Contact(int id)
{
    ViewBag.Message = id;
    //ViewBag.Message = "Your contact page.";

    return View();
}
```

我们可以在方法中接收多个参数，每个参数相当于一个占位

```CSharp
//两种url，接收的参数都相同，只是一个占位符
//http://localhost:3150/contract/2020/01/01
//http://localhost:3150/contract/foo/bar/baz
[Route("contract/{year}/{month}/{day}")]
public ActionResult Contact(string year, string month, string day)
{
    ViewBag.Message = year + month + day;
    //ViewBag.Message = "Your contact page.";

    return View();
}
```

### 使用控制器类的特性路由

很多时候，同样的控制器类下面，多个方法都是使用的相似的路由模板

```CSharp
public class HomeController : Controller
{
    [Route("home/index")]
    public ActionResult Index()
    {
        return View();
    }

    [Route("home/about")]
    public ActionResult About()
    {
        ViewBag.Message = "Your application description page.";

        return View();
    }

    [Route("home/contract")]
    public ActionResult Contact()
    {
        //ViewBag.Message = "Your contact page.";

        return View();
    }
}
```

我们可以使用控制器的特性路由，将前面的`home`省略掉，避免代码重复，便于维护

```CSharp
//action可以作为任意操作名称的占位符
[Route("home/{action}")]
public class HomeController : Controller
{
    //http://localhost:3150/home/index
    public ActionResult Index()
    {
        return View();
    }

    public ActionResult About()
    {
        ViewBag.Message = "Your application description page.";

        return View();
    }

    public ActionResult Contact()
    {
        //ViewBag.Message = "Your contact page.";

        return View();
    }
}
```

有时候，某些操作具有其他的操作稍微不同的路由，我们可以将最通用的提取放到控制器上，然后具有不同路由模式的操作重写默认路由。

```CSharp
   [Route("home/{action}")]
    public class HomeController : Controller
    {
        //localhost:6556/
        //localhost:6556/home
        [Route("")]
        [Route("home")]
        public ActionResult Index()
        {
            return View();
        }
        //localhost:6556/home/About
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        //localhost:6556/home/Contact
        public ActionResult Contact()
        {
            return View();
        }
    }
```

**注：上面的示例中，由于没有添加`index`的`[Route("home/index")]`特性路由，所以无法通过`localhost:1234/home/index`访问，必须加上该特性才可以**

> 如果我们要自定义某个操作路由，并且仍然希望应用默认的路由，就需要在操作方法上（这里是`index`）再次列出控制器路由

```CSharp
//localhost:6556/
//localhost:6556/home
[Route("")]
[Route("home")]
[Route("home/index")]	
public ActionResult Index()
{
    return View();
}
```

### 使用路由前缀

前面的类仍然带有重复性，例如多次以`/home`开头，我们可以使用`RoutePrefix`，这样就只需要在一个地方指定路由以`/home`开头

```CSharp
[RoutePrefix("home")]
[Route("{action}")]
public class HomeController : Controller
{
    [Route("~/")]	//加这个，支持localhost:1234/
    [Route("")]		//localhost:1234/home
    [Route("index")]	//localhost:1234/home/index
    public ActionResult Index()
    {
        return View();
    }

    public ActionResult About()
    {
        ViewBag.Message = "Your application description page.";

        return View();
    }

    public ActionResult Contact()
    {
        //ViewBag.Message = "Your contact page.";

        return View();
    }
}
```

### 路由约束

当我们传入参数时，方法参数与路由参数容易混淆

```CSharp
[Route("about/{id}")]      //http://localhost:3150/home/about/23
public ActionResult About(int id)
{
    ViewBag.Message = "Your application description page. \t" + id.ToString();

    return View();
}
```

当我们传入`23`时，链接：`http://localhost:3150/home/about/23`，`id`代表了方法参数

![](https://i.imgur.com/6KpGviU.png)

但是当我们传入字符，`id`应该代表什么，链接：`http://localhost:3150/home/about/bob`。直接抛错

![](https://i.imgur.com/T4SLaEi.png)

这时候我们可以利用方法重写，让方法可以接收数字、字符

```CSharp
//由于两个方法一致，传入参数的时候，需要对路由参数做区分，否则会报错
[Route("about/{id:int}")]      //http://localhost:3150/home/about/23
public ActionResult About(int id)
{
    ViewBag.Message = "Your application description page. \t" + id;
    return View();
}

[Route("about/{name}")]      //http://localhost:3150/home/about/bob
public ActionResult About(string name)
{
    ViewBag.Message = "Your application description page. \t" + name;
    return View();
}
```

#### 内联约束

上面的示例中，放到路由模板中的约束，叫做内联约束，当然，还有其他的内联约束

> 如果URL看上去类似，但是具有不同的行为，就可以使用路由约束表达URL之间的区别

| 名称      | 示例                               | 描述                                                    |
| --------- | ---------------------------------- | ------------------------------------------------------- |
| bool      | {n:bool}                           | `Boolean`值                                             |
| datetime  | {n:datetime}                       | `DateTime`值                                            |
| decimal   | {n:decimal}                        | `Decimal`值                                             |
| double    | {n:double}                         | `Double`值                                              |
| float     | {n:float}                          | `Single`值                                              |
| guid      | {n:guid}                           | `Guid`值                                                |
| int       | {n:int}                            | Int32                                                   |
| long      | {n:long}                           | Int64                                                   |
| minlength | {n:minlength(2)}                   | String，至少包含两个字符                                |
| maxlength | {n:maxlength(2)}                   | String，至多包含两个字符                                |
| length    | {n:length(2)}<br />{n:length(2,4)} | String，刚好包含两个字符<br />String，包含2，3，4个字符 |
| min       | {n:min(1)}                         | Int64，大于或等于1                                      |
| max       | {n:max(3)}                         | Int64，小于或等于3                                      |
| range     | {n:range(1,3)}                     | Int64，1、2、3，一个范围                                |
| alpha     | {n:alpha}                          | String，只包含字符A-Z、a-z                              |
| regex     | {n:regex(^a+$)}                    | String，只包含一个以上的字符`a`*，正则表达式            |

### 路由的默认值

> 为路由参数提供默认值。

```CSharp
[Route("home/{action}")]
public class HomeController : Controller
{
    public ActionResult Index()
    {
        return View();
    }

    public ActionResult About()
    {
        ViewBag.Message = "Your application description page.";
        return View();
    }

    public ActionResult Contact()
    {
        //ViewBag.Message = "Your contact page.";
        return View();
    }
}
```
由上面示例运行，我们会自然的调用`/home`，然而当我们运行时，是会报错的，因为`/home`只包含了一个段，这时候，我们就需要为路由添加默认值，让`Index`变成默认的action，这样就可以默认运行`/home/Index`

### 可选参数

> 我们可以将路由的参数改为**可选参数**，这样写出的路由更加灵活，传参、不传参都不影响页面的展示

```CSharp
[RoutePrefix("home")]
public class HomeController : Controller
{
    [Route("index")]
    public ActionResult Index()
    {
        return View();
    }
	
    //localhost:1234/about/123
    //localhost:1234/about	将报错
    [Route("about/{id}")]
    public ActionResult About(int id)
    {
        ViewBag.Message = "Your application description page.";
        return View();
    }

    [Route("contract/{id}")]
    public ActionResult Contact(int id)
    {
        //ViewBag.Message = "Your contact page.";
        return View();
    }
}

```

改为可选参数后

```CSharp
[RoutePrefix("home")]
[Route("{action=Index}/{id?}")]
public class HomeController : Controller
{
    //http://localhost:3150/home/index
    public ActionResult Index()
    {
        return View();
    }
	
    //两者都可以
    //http://localhost:3150/home/about
    //http://localhost:3150/home/about/123
    public ActionResult About(int id = 0)
    {
        ViewBag.Message = "Your application description page.";
        return View();
    }
	
    public ActionResult Contact(int id = 0)
    {
        //ViewBag.Message = "Your contact page.";
        return View();
    }
}
```

如果改为可选参数后，方法没有默认赋值，就会出现问题

```CSharp
[RoutePrefix("home")]
[Route("{action=Index}/{id?}")]
public class HomeController : Controller
{
    //http://localhost:3150/home/about 报错
    //http://localhost:3150/home/about/123  正常运行
    public ActionResult About(int id)
    {
        ViewBag.Message = "Your application description page.";
        return View();
    }
}
```



## 笔记

> + 从技术角度看，所有`URL`都是`URI`。`W3C`认为<u>“URL是一个非正式的概念，但它非常有用：URL是URI的一种类型，它通过表示自身的主要访问机制来标识资源”</u>。换句话说，`URI`是某种资源的标识符，而`URL`则为获取该资源提供了具体的信息。
>
> + 传入路由特性的字符串叫模板，它就是一个模式匹配规则。决定了这个路由是否适用传入的请求。只有当`URL`路径具有完全相同的字符串时，路由才会与之匹配。
>
>   例如：
>
>   ```CSharp
>   [Route("")]
>   public ActionResult Index(){
>       return View();
>   }
>   ```
>
>   它只能匹配`/localhost:1234`
>
> + 当特性路由匹配并运行操作方法时，模型绑定会使路由的路由参数为同名的方法参数填充值
>
> + 有时控制器上的某些操作具有与其他操作稍微不同的路由，此时，我们可以把最通用的路由放到控制器上，然后具有不同路由模式的操作上重写默认路由
>
>   
