---
title: 表单和HTML辅助方法
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---
## 前言

> 在工作中遇到了太多关于MVC的问题，之前没有系统的学习过，现在趁闲暇时间好好吸收一些不熟悉的知识。第二章：表单和HTML辅助方法

<!-- more -->

## 表单

`form`标签默认使用`GET`方式提交到`action`指定的`url`

```html
<form action="https://www.bing.com/search">
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
</form>
```

也可以通过指定`method`属性的方式，使用`POST`提交

```html
<form action="https://www.bing.com/search" method="POST">
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
</form>
```

> 通常情况下，Web应用程序中，`GET`请求用于读操作，`POST`请求用于写操作（通常包括更新、创建、删除）

## HTML辅助方法

### 添加额外属性

html元素中，我们可以在其标签中添加任意额外的属性，以帮助我们更好的进行判断，控制，辅助方法也可以做到这些

```html
<!--form，添加额外属性:target-->
@using(Html.BeginForm("Search","Home",FormMethod.Get,
	new { target="_blank" }))
{
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
}

<!--form，渲染后:-->
<form action="/Home/Search" method="get" target="_blank">
    <input name="q" type="text" />
    <input type="submit" value="Search!" />
</form>
```

### 注意事项

当我们在使用HTML辅助方法时，我们可能会引用`css`样式，或者是添加`data-value`的属性来表示值，这时候，需要做一些特殊的处理

```html
<!--form，添加额外属性:css-->
@using(Html.BeginForm("Search","Home",FormMethod.Get,
	new { target="_blank", @class="form1", data_value="123" }))
{
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
}

<!--form，渲染后:-->
<form action="/Home/Search" method="get" target="_blank" class="form1" data-value="123">
    <input name="q" type="text" />
    <input type="submit" value="Search!" />
</form>
```

### Html.BeginForm

`form`表单有一个更简单的HTML辅助方法，可以让我们省略一些操作

```html
<!--传统方式-->
<form action="https://www.bing.com/search" method="GET">
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
</form>

<!--HTML辅助方法-->
@using (Html.BeginForm("Search","Home",FormMethod.Get)){
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
}

<!--HTML辅助方法：也可以使用这种方式-->
@{Html.BeginForm("Search","Home",FormMethod.Get);}
	<input name="q" type="text" />
    <input type="submit" value="Search!" />
@{Html.EndForm();}


<!--若视图响应了/StoreManager/Edit/23-->
@using(Html.BeginForm())
{
	@Html.ValidationSummary(excludePropertyErrors:true)
	<fieldset>
     	<legend>
            Edit Album
        </legend>   
        <p>
            <input type="submit" value="Save" />
        </p>
	</fieldset>
}
<!--渲染后结果-->
<form action="/StoreManager/Edit/23" method="POST">
    ...
</form>
```

### Html.ValidationSummary

```html
@using(Html.BeginForm())
{
	@Html.ValidationSummary(excludePropertyErrors:true)
	<fieldset>
     	<legend>
            Edit Album
        </legend>   
        <p>
            <input type="submit" value="Save" />
        </p>
	</fieldset>
}
```

`Html.ValidationSummary`可以显示`ModelState`字典中的所有验证错误，然后可以使用`bool`类型值来选择是否显示`模型级错误`还是所有错误。

假设后端有一段设置`ModelState`的代码：

```CSharp
//模型级错误：因为没有提供与具体属性相关联的键
ModelState.AddModelError("","This is all wrong!");
//属性级错误：与Title属性相关联
ModelState.AddModelError("Title","What a terrible wrong!");
```

这样的话，若代码如开头所示，则视图验证错误的时候，将不会显示第二个错误，将渲染成：

```html
<div class="validation-summary-errors">
    <ul>
        <li>This is all wrong!</li>
    </ul>
</div>
```

### Html.TextBox

```html
<!--HTML辅助方法-->
@Html.TextBox("Title",Model.Title)
<!--渲染后的元素-->
<input id="Title" name="Title" type="text" value="" />
```

### Html.TextArea

```html
<!--HTML辅助方法-->
@Html.TextArea("text","Hello <br/> world")

<!--渲染后的元素：会自动对HTML进行编码，防止XSS（跨站点脚本）攻击-->
<textarea cols="20" id="text" name="text" rows="2">
	Hello &lt;br /&gt; world 
</textarea>

<!--还可通过指定行数、列数控制文本-->
@Html.TextArea("text","hello <br /> world", 10, 80, null)
<!--渲染-->
<textarea cols="80" id="text" name="text" rows="10">
	Hello &lt;br /&gt; world 
</textarea>

```

### Html.Label

其中自动渲染的`for`属性很有用，可以与`input`标签扩大选中范围，当点击`label`时，焦点会自动聚焦到input标签上，这对单选、复选框、下拉列表等同样有效。

```html
@Html.Label("GenerId")
<label for="GenerId">Gener</label>
```

### Html.DropDownList与Html.ListBox

他们都会返回一个`select`元素，`DropDownList`允许进行单选，`ListBox`可以多选（需要设置属性，`multiple`设置为`multiple`）

```html
<!--单选-->
@Html.DropDownList("GenerId", null, htmlAttributes: new { @class = "form-control" })
<select class="form-control valid" id="GenerId" name="GenerId">
    <option selected="selected" value="1">Rock</option>
    <option value="2">Jazz</option>
</select>
```

后端也需要做一部分工作

```CSharp
public ActionResult Edit(int? id)
{
    ...
        Album album = db.Albums.Find(id);
    //第一种：
    //生成SelectList并返回到前端
    //SelectList指定了原始集合，作为后台使用的属性名称GenerId，作为前端显示的Name，以及单选默认选中的那项
    ViewBag.GenerId = new SelectList(db.Genres, "GenerId", "Name", album.GenerId);

    //第二种：
    //也可以自己根据需求生成SelectList
    //生成自己想要的selectListItem集合
    ViewBag.GenerId = db.Genres
        .OrderBy(g => g.Name)
        .AsEnumerable()
        .Select(g => new SelectListItem
                {
                    //显示的name
                    Text = g.Name+"(自定义)",
                    //后台使用的id
                    Value = g.GenerId.ToString(),
                    //默认选中值
                    Selected = g.GenerId == album.GenerId
                });
    return View(album);
}
```

第一种与第二种生成的前端区别

```html
<!--第一种-->
<select class="form-control valid" id="GenerId" name="GenerId">
    <option value="2">Jazz</option>
    <option selected="selected" value="1">Rock</option>
</select>
<!--第二种-->
<select class="form-control valid" id="GenerId" name="GenerId">
    <option value="2">Jazz(自定义)</option>
    <option selected="selected" value="1">Rock(自定义)</option>
</select>
```

![](https://i.imgur.com/B4p6z8m.png)

<center>第一种</center>
![](https://i.imgur.com/XvHQlmH.png)

<center>第二种</center>
### Html.ValidationMessage

可以使用这个辅助方法，显示特定的错误消息

后端

```CSharp
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult Edit()
{
    var album = new Album();
	//对Price字段添加一个自定义的错误消息
    //当点击保存的时候，会验证这个字段，若出现错误，即会在前端显示出来
    ModelState.AddModelError("Price", "What a terrible name!");
    
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

前端

```html
<!--渲染前-->
@Html.ValidationMessageFor("Price")
<!--渲染后（当出现错误时，会显示在Price输入框下方）-->
<span class="field-validation-error" data-valmsg-for="Price" data-valmsg-replace="true">What a terrible name!</span>

<!--也可以重写视图中的错误消息-->
@Html.ValidationMessage("Price","this is a wrong")
<!--渲染后（当出现错误时，会显示在Price输入框下方）-->
<span class="field-validation-error" data-valmsg-for="Price" data-valmsg-replace="false">this is a wrong</span>
```

### Html.Editor

它作用与`Html.TextBox`差不多，但是它更加灵活，它在请求数据的时候，会根据数据注解推断生成的元素，这样可以减少我们的开发工作量，因为不需要修改任何地方，只是根据需求修改模型的注解

```html
<p>
    @Html.TextBoxFor(m=>m.Title)
</p>
<p>
    @Html.EditorFor(m=>m.Title)
</p>

<!--在未添加数据注解时，生成的元素是一样的-->
<p>
    <input id="Title" name="Title" type="text" value="Caravan" >
</p>
<p>
    <input id="Title" name="Title" type="text" value="Caravan" >
</p>
```

但是当提供了数据注解后

```CSharp
public class Album
{
    //...
    [DataType(DataType.MultilineText)]
    public virtual string  Title { get; set; }
	//...
}
```

前端

```html
<p>
    @Html.TextBoxFor(m=>m.Title)
</p>
<p>
    @Html.EditorFor(m=>m.Title)
</p>

<!--在未添加数据注解时，生成的元素是一样的-->
<p>
    <input id="Title" name="Title" type="text" value="Caravan" >
</p>
<p>
    <textarea class="text-box multi-line valid" id="Title" name="Title">Caravan</textarea>
</p>
```

### 使用字符串提取值（辅助方法）

#### 第一种方式

后端代码

```CSharp
public ActionResult Edit(int? id)
{
    ViewBag.Price = 10.0;
    return View();
}
```

前端可以使用`TextBox`辅助方法来渲染

```html
@Html.TextBox("Price")
<!--渲染后结果-->
<input data-val="true" id="Price" name="Price" type="text" value="10" >
```

页面显示

![](https://i.imgur.com/Ug1F9Ig.png)

#### 第二种方式

后端代码

```CSharp
public ActionResult Edit(int? id)
{
    ViewBag.Album = new Album { Price = 11 };
    return View();
}
```

前端可以使用`TextBox`辅助方法来渲染

辅助方法会尝试取`ViewData`中找`Album.Price`，若没有找到，则会尝试去找一个`Album`对象，然后找到`Price`属性，找到值

```html
@Html.TextBox("Album.Price")
<!--渲染后结果,id中不能包含点，所以使用下划线替代，name中可以包含，所以继续使用点-->
<input id="Album_Price" name="Album.Price" type="text" value="11">
```

页面显示与第一种类似

#### 第三种方式

强类型识图数据

```CSharp
public ActionResult Edit(int? id)
{
    var album = new Album { Price = 12.0m };
    return View(album);
}
```

前端

```html
@Html.TextBox("Price")
<!---->
<input id="Price" name="Price" type="text" value="12.0">
```

### 使用强类型辅助方法提取值

```html
<!--头部需要指定强类型-->
@model MVCMusicStore_m.Models.Album

<!--然后即可使用强类型添加表单-->
@using (Html.BeginForm())
{
    @Html.ValidationSummary(excludePropertyErrors:true)
    <fieldset>
        <legend>Edit Album</legend>
        <p>
            @Html.LabelFor(m=>m.GenerId)
            @Html.DropDownListFor(m=>m.GenerId,ViewBag.Genres as SelectList)
        </p>
        <p>
            @Html.TextBoxFor(m=>m.Title)
            @Html.ValidationMessageFor(m=>m.Title)
        </p>
        <input type="submit" value="Save" />
    </fieldset>
}
```

渲染后

```html
<form action="/StoreManager/Edit/1" method="post" novalidate="novalidate">    
    <fieldset>
        <legend >Edit Album</legend>
        <p>
            <label for="GenerId">GenerId</label>
            <select data-val="true" data-val-number="字段 GenerId 必须是一个数字。" data-val-required="GenerId 字段是必需的。" id="GenerId" name="GenerId" class="valid">
                <option value="2">Jazz</option>
                <option selected="selected" value="1">Rock</option>
            </select>
        </p>
        <p>
            <input id="Title" name="Title" type="text" value="Caravan" class="valid">
            <span class="field-validation-valid" data-valmsg-for="Title" data-valmsg-replace="true"></span>
        </p>
        <input type="submit" value="Save">
    </fieldset>
</form>
```

### Html.Hidden

用于渲染隐藏的输入元素

```html
@Html.Hidden("name","john")
@Html.HiddenFor(m=>m.Title)

<input id="name" name="name" type="hidden" value="john">
<input id="Title" name="Title" type="hidden" value="Caravan">
```

### Html.Password

```html
@Html.Password("uspwd")
@Html.PasswordFor(m => m.Title);

<input id="uspwd" name="uspwd" type="password">
<input id="Title" name="Title" type="password">
```

### Html.RadioButton

```html
@Html.RadioButton("color", "red")
@Html.RadioButton("color", "blue",true)
@Html.RadioButton("color","green")

<input id="color" name="color" type="radio" value="red">
<input checked="checked" id="color" name="color" type="radio" value="blue">
<input id="color" name="color" type="radio" value="green">


@Html.RadioButtonFor(m => m.GenerId, "1") Rock
@Html.RadioButtonFor(m => m.GenerId, "2") Jazz
@Html.RadioButtonFor(m=>m.GenerId,"3") Pop

<input checked="checked" id="GenerId" name="GenerId" type="radio" value="1"> Rock
<input id="GenerId" name="GenerId" type="radio" value="2"> Jazz
<input id="GenerId" name="GenerId" type="radio" value="3"> Pop
```

### Html.CheckBox

```html
@Html.CheckBox("IsDiscounted")
<!--
	由于HTML规定浏览器只提交选中的复选框值，这样的话，当没有被选中的时候，保证也能进行提交，所以有一个隐藏的元素
-->
<input id="IsDiscounted" name="IsDiscounted" type="checkbox" value="true">
<input name="IsDiscounted" type="hidden" value="false">
```

### Html.ActionLink

生成一个超链接：`a`标签

```html
<!--链接显示名称，操作名称-->
@Html.ActionLink("Back to List", "Index")
<a href="/StoreManager" style="">Back to List</a>

<!--指定操作、以及控制器名称-->
@Html.ActionLink("Back to Home", "Index","Home")
<!--"/" ==> ""/Home/Index"-->
<a href="/" >Back to Home</a>

<!--传入参数-->
@Html.ActionLink("Back to Home", "Index","Home",new { id = 10720},null)
<a href="/Home/Index/10720">Back to Home</a>
```

### Html.RouteLink

与`ActionLink`一样，但是它不能接收控制器名称和操作名称，只能接收路由名称

```html
@Html.RouteLink("Link Text",new { action = "Index"})
<a href="/StoreManager">Link Text</a>

@Html.RouteLink("Link Text",new { action = "Index",controller="Home"})
<a href="/">Link Text</a>
```

### Url.Action

只是生成一个链接，可以用作站点地图

```html
<span>
    @Url.Action("Edit", "Store", new { genres = "Jazz" }, null)
</span>

<span>
    /Store/Edit?genres=Jazz
</span>

<span>
    <!--默认的：显示当前页面的URL-->
    @Url.Action()
</span>

<span>
    /StoreManager/Edit/1
</span>
```

### Url.Content

可以使用它将应用程序的相对路径转为绝对路径

> 使用`~`，可以更方便的开发，无论程序部署到哪里，都能找到相应的资源、路径

```html
<script src="@Url.Content("~/Scripts/jquery-1.10.2.min.js")" type="text/javascript"></script>
<!--渲染后-->
<script src="/Scripts/jquery-1.10.2.min.js" type="text/javascript"></script>

<!--或者也可以直接写成-->
<script src="~/Scripts/jquery-1.10.2.min.js" type="text/javascript"></script>
<!--渲染后-->
<script src="/Scripts/jquery-1.10.2.min.js" type="text/javascript"></script>
```

### Url.RouteUrl

生成链接

`Url.Action`与`Html.ActionLink`相似，`Url.RouteUrl`与`Html.RouteLink`相似

```html
<span>
    @Url.RouteUrl(new { action = "Index" })
</span>
<span>
    /StoreManager
</span>
```

### Html.Partial

渲染部分视图

示例，后端

```CSharp
public ActionResult AlbumDisplay()
{
    //返回一个部分视图
    return PartialView();
}
```

视图`AlbumDisplay.cshtml`

```html
@{
	ViewBag.Title = "AlbumDisplay";
}
<h2>AlbumDisplay</h2>
```

示例，前端`Edit.cshtml`

```html
<!--渲染一个部分视图-->
@Html.Partial("AlbumDisplay")
<!--渲染结果-->
<h2>AlbumDisplay</h2>
```

### Html.RenderPartial

与`Html.Partial`类似，但是这个辅助方法更适合于写入代码块中，因为它可以直接写入响应输出流。对于高流量、循环调用部分视图时，更适合使用它。

```html
<!--渲染一个部分视图-->
@{Html.RenderPartial("AlbumDisplay");}
<!--渲染结果-->
<h2>AlbumDisplay</h2>
```

### Html.Action

类似于分布视图，只渲染一部分的视图，例如在下面的例子中，只渲染Index中的菜单部分

后端

```CSharp
public class StoreManagerController : Controller
{
    //首页
    public ActionResult Index()
    {
        return View();
    }
	
    //菜单，部分视图
    public ActionResult Menu()
    {
        //四个菜单
        List<menu> list = new List<menu>()
        {
            new Models.menu{Text = "菜单1"},
            new Models.menu{Text = "菜单2"},
            new Models.menu{Text = "菜单3"},
            new Models.menu{Text = "菜单4"},
        };
        var menu = list;
        return PartialView(menu);
    }
}
```

前端，`Menu.html`

```html
@model List<MVCMusicStore_m.Models.menu>
@{
    ViewBag.Title = "Menu";
}

<h2>Menu</h2>

<ul>
    @foreach (var item in Model)
    {
        <li>@item.Text</li>
    }
</ul>
```

`Index.cshtml`

```html
@model IEnumerable<MVCMusicStore_m.Models.Album>

@{
    ViewBag.Title = "Index";
}

<h2>Index</h2>

@Html.Action("Menu")
```

渲染后，页面如下

![](https://i.imgur.com/tpNks5J.png)

但是这样还存在一个问题：可以直接访问`Menu`，获取所有菜单列表，比如访问：[http://localhost:3150/StoreManager/Index ](http://localhost:3150/StoreManager/Index)

就会出现所有菜单列表

![](https://i.imgur.com/OfCOMGO.png)

我们可以限制别人访问，后端需要添加一个属性即可

```CSharp
//菜单，部分视图
[ChildActionOnly]
public ActionResult Menu()
{
    //四个菜单
    List<menu> list = new List<menu>()
    {
        new Models.menu{Text = "菜单1"},
        new Models.menu{Text = "菜单2"},
        new Models.menu{Text = "菜单3"},
        new Models.menu{Text = "菜单4"},
    };
    var menu = list;
    return PartialView(menu);
}
```

这样，访问的时候就会出现错误

![](https://i.imgur.com/YRzfWug.png)

`Html.Action`前端直接传值到后端

```html
@Html.Action("Menu", new { options = new MenuOptions { Width = 400, Height = 500 } })
```

后端接收

```CSharp
public ActionResult Menu(MenuOptions options)
{
    return PartialView(options);
}
```

或者使用其他名称调用后端方法（比如方法名冲突时，或者可能会使用多个后端方法时）

```html
@Html.Action("CoolMenu")
```

后端

```CSharp
//必须声明这个名称，才能调用该方法
[ActionName("CoolMenu")]
public ActionResult Menu(MenuOptions options)
{
    return PartialView(options);
}
```

### Html.RenderAction

与`Html.Action`差不多，但是它是直接写入响应流中，有一些微的效率提升

