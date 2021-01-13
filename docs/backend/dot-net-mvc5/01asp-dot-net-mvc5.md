---
title: 控制器、试图、模型
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---

## 前言

> 在工作中遇到了太多关于MVC的问题，之前没有系统的学习过，现在趁闲暇时间好好吸收一些不熟悉的知识。第一章：控制器、试图、模型

<!-- more -->

## 控制器

### HttpUtility.HtmlEncode

预处理用户输入，防止用户用链接向视图中诸如`JavaScript`代码或`HTML`标记

```CSharp
// GET: Store/Browse?genre=?Disco  
//展示该流派下所有音乐专辑
public string Browse(string genre)
{
    string message = HttpUtility.HtmlEncode("Store.Browse, Genre = " + genre);
    return message;
}
```

正确浏览：

![image-20191024220210051](https://i.imgur.com/nbqgGs2.png)

注入示例：

![image-20191024220125954](https://i.imgur.com/z2j2Z7g.png)

## 视图

### 视图约定

ASP.NET MVC中的大部分视图如约定设置一样

```CSharp
public class HomeController : Controller
{
    public ActionResult Index()
    {
        //返回的视图路径是/Views/Home/Index.cshtml
        return View();
    }
}
```

但是这种约定可以重写

例如：当我想在`Index`方法里面返回另外一个视图`/Home/NoIndex.cshtml`时

```CSharp
public class HomeController : Controller
{
    public ActionResult Index()
    {
        //返回的视图路径是/Views/Home/NoIndex.cshtml
        return View("NoIndex");
    }
}
```

再或者，我们需要不同目录下的控制器视图，针对这种情况，我们需要添加`~`符号来提供视图完整路径

```CSharp
public class HomeController : Controller
{
    public ActionResult Index()
    {
        //返回的视图路径是/Views/Example/Index.cshtml
        //必须添加后缀，因为找的路径不是当前控制器的视图（Views/Home）目录下的
        return View("~/Views/Example/Index.cshtml");
    }
}
```

### 强类型视图

#### 第一种：后端使用`ViewBag`

```CSharp
//后端：AlbumController.cs
public ActionResult List()
{
    var albums = new List<Album>();
    for (int i = 0; i < 10; i++)
    {
        albums.Add(new Album { Title = "Product" + i });
    }
    ViewBag.Albums = albums;
    return View();
}
```

```html
<!--前端一：使用as关键字转换类型-->
@{
    ViewBag.Title = "Index";
}
<h2>使用as关键字强制转换类型</h2>
<ul>
    @foreach (Album a in ViewBag.Albums as IEnumerable<Album>)
    {
        <li>
            @a.Title
        </li>
    }
</ul>
    
<!--前端二：使用dynamic关键字转换类型-->
@{
    ViewBag.Title = "Index";
}
<h2>使用dynamic关键字保持代码整洁，但是这样无法使用智能感知（提示）</h2>
<ul>
    @foreach (dynamic a in ViewBag.Albums)
    {
        <li>
            @a.Title
        </li>
    }
</ul>
```

#### 第二种：后端使用`View()`重载方法

```CSharp
public ActionResult Index()
{
    var albums = new List<Album>();
    for (int i = 0; i < 10; i++)
    {
        albums.Add(new Album { Title = "Product" + i });
    }
    return View(albums);
}
```

```html
<!--前端一：使用关键字@model声明-->
@model IEnumerable<MvcMusicStore.Models.Album>
@{
    ViewBag.Title = "Index";
}
<!--告知视图哪种类型的模型正在使用@model声明-->
<h2>使用智能感知，使用关键字@model</h2>
<ul>
    @foreach (Album a in ViewBag.Albums as IEnumerable<Album>)
    {
        <li>
            @a.Title
        </li>
    }
</ul>
    
<!--前端二：使用@using关键字声明-->
@using MvcMusicStore.Models
@model IEnumerable<Album>
@{
    ViewBag.Title = "Index";
}
<h2>使用@using关键字声明</h2>
<ul>
    @foreach (dynamic a in ViewBag.Albums)
    {
        <li>
            @a.Title
        </li>
    }
</ul>
```

### Razor

#### 语法二义性

用`()`或`@@`解决

```html
@{
	string message = "MyApp";
}
<span>@message.Model</span>
<!--想要输出<span>Myapp.Model</span>，会报错，message没有Model类型-->
<!--解决：-->
<span>@(message).Model</span>


<!--尝试输出下面语句-->
<p>
  You should Follow
  @aspnet
</p>
<!--需要写成如下形式：-->
<p>
  You should Follow
  @@aspnet
</p>
```

#### 跨站脚本注入攻击

```html
@{
    string message = "<script>alert('haacked!')</script>";
}
<span>@message</span>    
<!--输出这一句字符串，并不会提示-->
<script>alert('haacked!')</script>
<!--因为已经对message进行了编码-->
<!--实际输出：-->
<!--&lt;script&gt;alert(&#39;haacked!&#39;)&lt;/script&gt;-->

<!--如果想要输出HTML-->
@{
	string message = "<strong>This is bold!'</strong>";
}
<!--输出不经过HTML编码的消息-->
<span>@Html.Raw(message)</span>
<!--输出：-->
<span><strong>This is bold!'</strong></span>

<!--如果想要执行脚本-->

```

#### 语法示例

##### 隐式代码表达式

```html
<span>@model.Message</span>
<!--显示-->
<span>hello world</span>
```

##### 显示代码表达式

```html
<span>1 + 2 = @(1 + 2)</span>
<!--显示-->
<span>1 + 2 = 3</span>
```

##### 无编码表达式

```html
@{
    string message = "<strong>John</strong>";
}
<span>Hello,@Html.Raw(message)</span>
<!--显示:姓名会被加粗-->
<span>Hello,<strong>John</strong></span>
```

##### 代码块

```html
@{
	string x = "123";
	int a = 100;
}
```

##### 文本标记结合

```html
@{ 
    List<string> list = new List<string>();
    list.Add("Kana");
    list.Add("Ann");
    list.Add("Jack");
}
<ul>
    @foreach (var name in list)
    {
        <li>Name:@name.</li>
        <!--<li>Name:Kana.</li>-->
    }
</ul>
```

##### 混合代码与纯文本

```html
@{
    bool showMessage = true;
}
@if (showMessage)
{
    <!--将标签写入响应中，标签本身不写入-->
    <text>This is a plain text</text>
}

@if (showMessage)
{
    <!--只能转换一行文本-->
    @:This is a plain text
}
```

##### 转义代码分隔符

```html
The ASP.NET Twitter Handle is &#64;aspnet
The ASP.NET Twitter Handle is @@aspnet

<!--显示-->
The ASP.NET Twitter Handle is @aspnet
The ASP.NET Twitter Handle is @aspnet
```

##### 服务器端的注释

`@*content*@`：可以注释一行、多行

```html
@*The ASP.NET Twitter Handle is &#64;aspnet
The ASP.NET Twitter Handle is @@aspnet

<p>This is the main content</p>

@section Footer{
    This is the <strong>Footer</strong>
}*@
```

##### 调用泛型方法

由于尖括号会导致Razor回转标记，会报错，所以需要添加括号

```html
@(Html.SomeMethod<AType>())
```

#### 布局

##### 第一版

布局文件：`_SiteLayout.cshtml`

```html
<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>@ViewBag.Title</title>
</head>
<body>
    <h1>@ViewBag.Title</h1>
    <div id="main-content">
        @RenderBody()
    </div>
</body>
</html>
```

引用布局：`Index.cshtml`

```html
@{
    Layout = "~/Views/Shared/_SiteLayout.cshtml";
    ViewBag.Title = "Index";
}
<p>This is the main content!</p>
```

最终展示内容

```html
<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
	<!--被Index替换-->
    <title>Index</title>
</head>
<body>
	<!--被Index替换-->
    <h1>Index</h1>
    <div id="main-content">
		<!--被Index中的内容替换-->
        <p>This is the main content!</p>
    </div>
</body>
</html>
```

##### 第二版

**节**可以添加多个

布局页添加节点，比如页脚：`_SiteLayout.cshtml`

添加完节之后，若不向该布局页的内容页添加对应节的内容，则会报错

```html
<!DOCTYPE html>

<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>@ViewBag.Title</title>
</head>
<body>
    <h1>@ViewBag.Title</h1>
    <div id="main-content">
        @RenderBody()
    </div>
    <footer>
        <!--添加Footer节-->
        @RenderSection("Footer")
    </footer>
</body>
</html>
```

引用页：`Index.cshtml`

```html
@{
    Layout = "~/Views/Shared/_SiteLayout.cshtml";
    ViewBag.Title = "Index";
}
<p>This is the main content!</p>
<!--添加内容-->
@section Footer{
    This is the <strong>Footer</strong>
}
```

最终展示

```html
<!DOCTYPE html>

<html>
    <head>
        <meta name="viewport" content="width=device-width" />
        <!--被Index替换-->
        <title>Index</title>
    </head>
    <body>
        <!--被Index替换-->
        <h1>Index</h1>
        <div id="main-content">
            <!--被Index中的内容替换-->
            <p>This is the main content!</p>
        </div>
        <footer>
            This is the <strong>Footer</strong>
        </footer>
    </body>
</html>
```

##### 第三版

`@section`语法为布局中定义了一个节指定了内容，但是默认情况下，比如为布局定义的每一个节提供内容，当向布局中添加一个新的节时，这样会使引用该布局的每一个视图都不正常，这时候就需要在`RenderSection`方法中添加一个指定内容

```html
<footer>
    @RenderSection("Footer", required: false)
</footer>
```

##### 第四版

这样还是不太灵活，若我们能在默认的情况下添加一些内容就更好了，如下：

```html
<footer>
    @if (IsSectionDefined("Footer")) {
        @RenderSection("Footer");
    }
    else
    {
        <span>This is the default Fotter.</span>
    }
</footer>
```

#### ViewStart

`ViewStart`是整个MVC视图里面最先执行的，若很多页面，都需要引用相同的`Layout`布局页，那么可以使用`ViewStart`指定，然后其他页面可以默认使用这个`ViewStart`里面的布局页

_ViewStart.cshtml

```html
@{
    Layout = "~/Views/Shared/_SiteLayout.cshtml";
}
```

_SiteLayout.cshtml

```html
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <p>
            this is a layout html.
        </p>
        @RenderBody()
    </body>
</html>
```

~/Views/Sample/Index.html

```html
@{
	ViewBag.Title = "Index";
	Layout = "~/Views/Shared/_SiteLayout.cshtml"
}
```

可以省略Layout部分：

```html
@{
	ViewBag.Title = "Index";
}
```

#### 部分视图

在使用局部刷新时，部分视图很有用，可以省略很多的代码。

`Controller`

```CSharp
public ActionResult Message() {
    ViewBag.Message = "This is a partial view.";
    //设置Message的值，返回部分视图
    return PartialView();
}
```

`Message.cshtml`（部分视图）不能使用指定布局，其他的看起来和正常布局没有区别

```html
<h2>@ViewBag.Message</h2>
```

最终渲染页

`controller`

```CSharp
public ActionResult PartialViewDemo() {
    //返回一个普通视图，它默认引用了ViewStart的布局页
    return View();
}
```

views

```html
@{
    View.Title = "PartialViewDemo";
}
<div id="result"></div>

@section scripts {
<script type="text/javascript">
    $(function () {
        //使用Ajax访问分布视图，并且将渲染后的分布视图加载到result元素中
        $('#result').load('/sample/message');
    });
</script>
}
```

## 模型

### 配置数据库连接

在项目中的`Web.config`（不是视图下的`Web.config`）中，我们可以使用连接字符串，指定数据库，或使用默认的`LocalDB`

```xml
<configuration>
    ...
    <connectionStrings>
        <add name="DefaultConnection" connectionString="Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\aspnet-MVCMusicStore_m-20191029061148.mdf;Initial Catalog=aspnet-MVCMusicStore_m-20191029061148;Integrated Security=True"
             providerName="System.Data.SqlClient" />
        <add name="MusicStoreDB" connectionString="Data Source=(localdb)\MSSQLLocalDB; Initial Catalog=MusicStoreDB-20191029065356; Integrated Security=True; MultipleActiveResultSets=True; AttachDbFilename=|DataDirectory|MusicStoreDB-20191029065356.mdf"
             providerName="System.Data.SqlClient" />
    </connectionStrings>
    ...
</configuration>
```

其中的`MusicStoreDB`，就是我们创建的数据库上下文类（使用基于MVC5，包含视图的控制器，在其中新增的数据库上下文，他会在`\Models`中生成`MusicStoreDB`类）

```CSharp
public class MusicStoreDB : DbContext
{
    //name可以指定为任意名称，相对的，Web.config需要相对应name的连接字符串
    public MusicStoreDB() : base("name=MusicStoreDB")
    {
    }

    public System.Data.Entity.DbSet<MVCMusicStore_m.Models.Album> Albums { get; set; }

    public System.Data.Entity.DbSet<MVCMusicStore_m.Models.Artist> Artists { get; set; }

    public System.Data.Entity.DbSet<MVCMusicStore_m.Models.Genre> Genres { get; set; }
}
```

### 初始化器

当我们运行程序的时候，在开发阶段，可以快速修改数据库字段，这时**初始化器**将会提高我们的开发效率

例如：我们可以在其中设置，每次程序运行的时候，都将重新删除数据库，然后根据现有修改后的`Model`在创建一次

`Global.asax`

```CSharp
protected void Application_Start()
{
    //设置每次启动应用时，都重建一次数据库
    //传递一个IDatabaseInitializer对象
    //一个对象是DropCreateDatabaseAlways，删除后，重建数据库
    //另外一个是DropCreateDatabaseIfModelChanges，当model有改变，则删除、重建数据库
    Database.SetInitializer(new DropCreateDatabaseAlways<MusicStoreDB>);

    AreaRegistration.RegisterAllAreas();
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

在例如：我们还可以设置，每次删除后，重新创建的时候，插入一些默认的数据，以方便测试我们开发的功能是否正常

`Global.asax`

```CSharp
protected void Application_Start()
{
    //注册【每次启动时，删除数据库，新增默认数据】初始化器
  
    Database.SetInitializer(new MusicStoreDbInitializer());

    AreaRegistration.RegisterAllAreas();
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

`/Models/MusicStoreDbInitializer.cs`

在其中插入一些默认数据，当我们开始运行应用程序的时候，这些数据就会存在里面

```CSharp
public class MusicStoreDbInitializer : System.Data.Entity.DropCreateDatabaseAlways<MusicStoreDB>
{
    /// <summary>
    /// 设置每次启动时，数据库中的默认数据
    /// </summary>
    /// <param name="context"></param>
    protected override void Seed(MusicStoreDB context)
    {
        context.Artists.Add(new Artist { Name = "Al Di Meola" });
        context.Genres.Add(new Genre { Name = "Jazz" });
        context.Albums.Add(new Album
                           {
                               Artist = new Artist { Name = "Rush" },
                               Genre = new Genre { Name = "Rock" },
                               Price = 9.99m,
                               Title = "Caravan",
                           });

        base.Seed(context);
    }
}
```

### 数据库迁移

> 数据库迁移也支持在Global.asax中添加，不过操作更为复杂，所代表的功能也更高级，它可以实现例如：在改变某个字段后，数据不会情况，程序可以照常启动、运行。

### 数据渲染页面

当在前端需要展示一个下拉列表时

前端：

```html
<div class="form-group">
    @Html.LabelFor(model => model.GenerId, "GenerId", htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        @Html.DropDownList("GenerId", null, htmlAttributes: new { @class = "form-control" })
        @Html.ValidationMessageFor(model => model.GenerId, "", new { @class = "text-danger" })
    </div>
</div>
```

后端：

```CSharp
//构建下拉列表需要的数据
//参数说明：
//1. 指定了将要放在列表中的项
//2. 属性名称（选中指定项目时使用的值：例如选中第一个，则值是1，名称是Rock）
//3. 要显示的文本(Rock，Rush等)
//4. 包含最初选定值
ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
```

### 数据保存

当用户编辑后点击提交时，`HTML`会发送一个`HTTP POST`请求，请求回到当前页面，浏览器这时候会收集表单输入的所有信息，以及`name`属性值，然后一起发送。这里需要注意的是`input`和`select`元素的`name`属性，**这些名称是要匹配Album模型中的属性名称**。

### 模型绑定

当前端将数据通过`HTTP POST`的方式提交到后端时，后端往往采用的是下面这种方式取数据

```CSharp
[HttpPost]
public ActionResult Edit()
{
	var album = new Album();
    album.Title = Request.Form["Title"];
    album.Price = Decimal.Parse(Request.Form["Price"]);
    ...
}
```

这时候，我们可以使用模型绑定来省略繁杂的操作

当模型绑定器看到`Album`具有`TItle`属性，它就会在请求中（不是表单中）查找（值提供器在请求的不同区域查找，比如`URL`、路由、表单集合）参数

#### 默认绑定

它会自动从请求的数据中查找出`Album`相关的属性值，然后组装成`Album`对象

```CSharp
[HttpPost]
public ActionResult Edit(Album album)
{
	...
}
```

它也支持将原型参数传入，比如`GET`请求

它会从`URL`中查询`ID`值：`/StoreManager/Edit/1`或`/StoreManager/Edit?id=1`

```CSharp
public ActionResult Edit(int id)
{
	...
}
```

有时候，我们接收的类中，几个字段不需要（`Album`会尽可能的查找相关的字段），这时候，若有人恶意提交相关的字段，就会造成程序崩溃

`Album`类：其中，`Genre`与`Artist`是不需要传入的字段

```CSharp
public class Album
{
    [Key]
    public virtual int  AlbumId { get; set; }
    public virtual int  GenerId { get; set; }
    public virtual int  ArtistId { get; set; }
    public virtual string  Title { get; set; }
    public virtual decimal Price { get; set; }
    public virtual string AlbumArtUrl { get; set; }
    /// <summary>
    /// 流派
    /// </summary>
    public virtual Genre Genre { get; set; }
    /// <summary>
    /// 艺术家
    /// </summary>
    public virtual Artist Artist { get; set; }
}
```

这时候我们在保存的时候，就避免接收这两个属性

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit([Bind(Include = "AlbumId,GenerId,ArtistId,Title,Price,AlbumArtUrl")] Album album)
{
    //若验证未通过，album会继续被返回，用于重新构建下拉列表，以及相关信息
    if (ModelState.IsValid)
    {
        db.Entry(album).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    ViewBag.ArtistId = new SelectList(db.Artists, "ArtistId", "Name", album.ArtistId);
    ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
    return View(album);
}
```

![](http://image.ruanheng.xyz/images/devenv_3X22KeiPVK.png)

#### 显示模型绑定

`UpdateModel()`若出现错误，或模型无效时，将会抛出异常

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit()
{
    var album = new Album();
    try
    {
        //验证模型绑定，默认查找所有album中的属性
        UpdateModel(album);
        db.Entry(album).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    catch (Exception)
    {
        ViewBag.ArtistId = new SelectList(db.Artists, "ArtistId", "Name", album.ArtistId);
        ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
        return View(album);
    }
}
```

`TryUpdateModel()`绑定失败则返回false，绑定成功则返回true

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit()
{
    var album = new Album();
    if (TryUpdateModel(album))
    {
        db.Entry(album).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    else
    {
        ViewBag.ArtistId = new SelectList(db.Artists, "ArtistId", "Name", album.ArtistId);
        ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
        return View(album);
    }
}
```

也可以根据**模型状态**查看是否绑定成功（**模型绑定副产品就是模型状态**）

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit()
{
    var album = new Album();
    TryUpdateModel(album);
    if (ModelState.IsValid)
    {
        db.Entry(album).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    else
    {
        ViewBag.ArtistId = new SelectList(db.Artists, "ArtistId", "Name", album.ArtistId);
        ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
        return View(album);
    }
}
```

如前面的`Bind`特性一样，当我们使用**显示模型绑定**时，也可以指定允许绑定的属性

`UpdateModel()`与`TryUpdateModel()`都有重载的方法，接受一个字符串数组，用于指定绑定属性有哪些

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit()
{
    var album = new Album();
    try
    {
        //验证模型绑定，查找指定的album中的属性
        UpdateModel(album, new string[] { "AlbumId", "GenerId", "ArtistId", "Title", "Price", "AlbumArtUrl" });
        //TryUpdateModel(album, new string[] { "AlbumId", "GenerId", "ArtistId", "Title", "Price", "AlbumArtUrl" })
        db.Entry(album).State = EntityState.Modified;
        db.SaveChanges();
        return RedirectToAction("Index");
    }
    catch (Exception)
    {
        ViewBag.ArtistId = new SelectList(db.Artists, "ArtistId", "Name", album.ArtistId);
        ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);
        return View(album);
    }
}
```

