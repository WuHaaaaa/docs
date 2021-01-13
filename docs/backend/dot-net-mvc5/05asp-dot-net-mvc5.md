---
title: Ajax，jQuery插件用法
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---

## 前言

> 这一章，对应的是书上的第第八章，主要讲述Ajax，jQuery插件用法，对于我来说，查漏补缺最重要

<!-- more -->

## 正文

### 自定义脚本

个人脚本与公共脚本分开放置，个人脚本应放置于`/Scripts/App`目录下

### 引用脚本

引用公共脚本，可以使用`BundleConfig.cs`，按需加载`*.js`还是`*.min.js`

引用时，将`jQuery`放置于布局页底部，这样不影响顶部`html`渲染，`js`报错了，不至于没有任何内容

下面这种是推荐做法，这样也只需引入一次`jQuery`即可，其他依赖于jQuery的js也可以在子页面使用

_Layout.cshtml

```html
<body>
    <!--html元素-->
    <div>
        ...
        @RenderBody()
    </div>
    <!--大型js，放入底部，不会由于报错，而影响页面加载-->
    @Scripts.Render("~/bundles/jquery")
    @Scripts.Render("~/bundles/bootstrap")
    <!--留一个节供子页面的加载js-->
    @RenderSection("scripts", required: false)
</body>
```

/Home/Index.cshtml

```html
<div>
    ...
</div>

@section Scripts {
    <script src="~/Scripts/App/MusicScripts.js"></script>
}
```

具体的加载顺序是：

1. `Layout`中的`html`
2. `Index`中的`html`
3. `Layout`中的`jQuery`
4. `Index`中的`MusicScripts`

### 使用Ajax辅助方法（ActionLink）

`ASP.NET MVC 5`中也提供了对应的Ajax辅助方法，这有助于我们编写非侵入式代码

具体步骤如下：

我们需要一个`js文件`引用，`jquery.unobtrusive-ajax.js`

1. 下载NuGet包，`Install-Package Microsoft.jQuery.Unobtrusive.Ajax`

2. 引用包文件至所需页面（我是随便找的一个页面）

   `/StoreManager/Create.cshtml`

   ```html
   <div id="dailydeal">
       @Ajax.ActionLink("Click here",
       "DailyDeal",
       null,
       new AjaxOptions
       {
           UpdateTargetId = "dailydeal",   //服务器响应后，更新到DOM，
           //更新的时候模式：替换（将之前元素替换掉）
           //、插入到元素之前、插入到元素之后、整个替换（即当前容器dailydeal也不剩，全换掉）
           InsertionMode = InsertionMode.Replace,	//这里是替换  
           //请求方式
           HttpMethod = "GET",
           //可以添加Confirm弹窗
           Confirm = "do you like it ?",
       },
       //设置a标签样式
       new { @class = "btn btn-primary" });
   </div>
   
   @section Scripts {
       <script src="~/Scripts/jquery.unobtrusive-ajax.js"></script>
   }
   ```

   注：`Ajax`辅助方法需要配合安装的`js`文件一同使用，否则，`Ajax`生成的方法，只是单独的一个`Ajax`请求，不会有将结果返回，替换某元素之说，而是会直接跳转到一个新的页面

3. 后端代码

   ```cs
   [HttpGet]
   public ActionResult DailyDeal()
   {
       return Json(JsonConvert.SerializeObject(new { Code = -1, Message = "123" }), JsonRequestBehavior.AllowGet);
   }
   ```

4. 效果预览

   ![](https://i.imgur.com/2W6y2oi.gif)

### 使用Ajax表单（BeginFrom）

`BeginForm`常用于查询之类的地方

前端代码

```html
<div class="panel panel-default">
    <div class="panel-heading">Artist search</div>
    <div class="panel-body">
        //生成一个Form表单
        @using (Ajax.BeginForm("ArtistSearch", "StoreManager",
            new AjaxOptions
            {
                InsertionMode = InsertionMode.Replace,	//插入模式：替换
                HttpMethod = "GET",					  //get请求
                OnFailure = "searchFailed",				//请求失败，调用函数
                LoadingElementId = "ajax-loader",		//请求时，加载中的元素显示（类似于动画效果）
                UpdateTargetId = "searchresults",		//更新至哪个元素
            }))
        {
            <input type="text" name="q" />
            <input type="submit" value="search" />
            <i id="ajax-loader" class="glyphicon glyphicon-transfer" style="display:none"></i>
        }
        <!--这个就是接收更新的地方-->
        <div id="searchresults"></div>
    </div>
</div>

@section Scripts {
    <script src="~/Scripts/jquery.unobtrusive-ajax.js"></script>
}

<script>
    //当请求出现错误时，调用方法，提示用户
    function searchFailed() {
        $("#searchresults").html("Sorry,...");
    }
</script>
```

后端代码

```cs
[HttpGet]
public ActionResult ArtistSearch()
{
    //睡眠5秒，我们可以看一下加载中的动画效果
    Thread.Sleep(3000);
    List<string> list = new List<string>();
    //随机生成五个数
    for (int i = 0; i < 5; i++)
    {
        Random rand = new Random(i);
        list.Add(rand.Next().ToString());
    }
    //我们可以返回部分视图，更灵活的渲染页面
    return PartialView("_Result",list);
}
```

部分视图`_Result.cshtml`

```html
@model IEnumerable<string>
<div id="searchresults">
    <ul>
        @foreach (var item in (List<string>)Model)
        {
            <li>@item</li>
        }
    </ul>
</div>
```

效果预览（当点击时，会出现一个传输的标识）

![](https://i.imgur.com/wtil53R.gif)

### 使用`Jquery`验证

在填写表单时候，我们可能需要限制用户填写数据，例如：必填项、数字、数字范围、时间范围等，这时候，可以使用`Jquery`提供的表单验证`JS`库，在前面应该有记录用法

前端`/Account/Login.cshtml`

```html
<form>
    ...
</form>

@section Scripts{
	@Scripts.Render("~/bundles/jqueryval")
}
```

后端`/App_Start/BundleConfig.cs`

```CSharp
bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
    "~/Scripts/jquery.validate*"));
```

当然，我们也可以禁用非侵入式JavaScript和客户端验证

很简单，`web.config`中，配置一下

```xml
<appSettings>
	...
    <!--将以下两个任意值，改为false即可-->
    <add key="ClientValidationEnabled" value="true" /> 
    <!---->
    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
</appSettings>
```

我们也可以将这里配置了之后，在单个页面中启用、禁用相关功能

```html
@model MVCMusicStore_m.Models.Album
@{
    //执行脚本输入验证：true|false
    Html.EnableClientValidation(false);
    //启用非介入式脚本：true|false
    Html.EnableUnobtrusiveJavaScript(false);
}

@{
    ViewBag.Title = "Create";
}

<div>
    <!--其他代码-->
</div>
```

都设置为`false`后，界面的Ajax请求异步请求，使用不了，提交表单，会出现验证，但是会弹出到新页面

![](https://i.imgur.com/6Er8Ama.gif)

启用验证，禁用非介入式脚本

![](https://i.imgur.com/ycpVHlM.gif)

禁用验证，启用非介入式脚本

![](https://i.imgur.com/TJ1MGAu.gif)

全部功能启用

![](https://i.imgur.com/eNuaacj.gif)

### 自定义验证

在上面引用的示例中，Price字段就是有验证的字段，我们可以自定义验证规则

例如在Model中添加相应的特性

```CSharp
//字段不允许为空，否则提示
[Required(ErrorMessage = "This filed is required")]
//最大字符串长度不能超过160个字符，否则提示
//{0}占位，表示当前字段
[MaxLength(160,ErrorMessage ="the field {0} must be a string with a maximum length of 160.")]
public string Title { get; set; }
```

前端，我们需要引用相关的验证

```html
<form>
    <!--表单中-->
    <div class="form-group">
        @Html.LabelFor(model => model.Title, htmlAttributes: new { @class = "control-label col-md-2" })
        <div class="col-md-10">
            @Html.EditorFor(model => model.Title, new { htmlAttributes = new { @class = "form-control" } })
            <!--错误信息输出-->
            @Html.ValidationMessageFor(model => model.Title, "", new { @class = "text-danger" })
        </div>
    </div>

</form>
@section Scripts {
	@Scripts.Render("~/bundles/jqueryval")
}
```

而后我们观察生成页面的html

```html
<!--这个就是生成后的HTML-->
<!--input标签-->
<input class="form-control text-box single-line" data-val="true" data-val-maxlength="the field Title must be a string with a maximum length of 160." data-val-maxlength-max="160" data-val-required="This filed is required" id="Title" name="Title" type="text" value="">
<!--用于显示错误信息-->
<span class="field-validation-valid text-danger" data-valmsg-for="Title" data-valmsg-replace="true"></span>
```

代码中有`data-val`开头属性的地方，则是`jquery.valiidate.unobtrusive`脚本负责，它会通过点击、焦点事件给用户提供即时的错误反馈，然后当有错误的时候，它也可以阻止表单的提交，这样就少了一步在服务器上处理错误的步骤。

前面曾实现过一个`MaxWords`的自定义验证属性，用于验证最淡单词数目不得超过规定数目，不过是服务端的验证，如果我们需要在客户端进行验证，则需要做进一步的工作。

如果要在客户端执行验证，需要提供下面几点信息：

+ 如果验证失败，要显示的提示信息

+ 允许单词数的范围

+ 一段用来计算单词数量的`JavaScript`代码

  这些是我们下面要实现接口的方法中需要返回的数据

原始代码

```CSharp
/// <summary>
/// 自定义验证逻辑
/// 允许用户输入姓氏，单词量不超过10个
/// </summary>
public class MaxWordsAttribute : ValidationAttribute
{
    private readonly int _maxWords;
    /// <summary>
    /// 创建构造函数，传入限制单词的最大个数
    /// 提供一个默认的错误提示消息（在没有指定ErrorMessage时使用，同时支持多语言）
    /// </summary>
    /// <param name="maxWords"></param>
    public MaxWordsAttribute(int maxWords) : base("{0} has too many words.")
    {
        _maxWords = maxWords;
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        //value 即表示输入的值，若输入不为空，则进行验证单词长度
        //否则返回Success，表示验证通过
        if (value != null)
        {
            var valueAsString = value.ToString();
            //计算单词数
            if (valueAsString.Split(' ').Length > _maxWords)
            {
                //DisplayName表示当前正在验证的字段名，用来格式化错误信息（{0}的占位）
                var errorMessage = FormatErrorMessage(validationContext == null ? null : validationContext.DisplayName);
                //返回格式化后的错误信息
                return new ValidationResult(errorMessage);

                //也可以指定返回固定字符串（但是这么做不灵活，而且也不支持多语言）
                //return new ValidationResult("Too many words.");
            }
        }
        return ValidationResult.Success;
    }
}
```

改版后：

```CSharp
/// <summary>
/// 自定义验证逻辑
/// 允许用户输入姓氏，单词量不超过10个
/// </summary>
public class MaxWordsAttribute : ValidationAttribute, IClientValidatable /*实现这个接口的方法，帮助查找验证对象，并发送给客户端的元数据和规则,以便进行前端验证*/
{
    private readonly int _maxWords;
    /// <summary>
    /// 创建构造函数，传入限制单词的最大个数
    /// 提供一个默认的错误提示消息（在没有指定ErrorMessage时使用，同时支持多语言）
    /// </summary>
    /// <param name="maxWords"></param>
    public MaxWordsAttribute(int maxWords) : base("{0} has too many words.")
    {
        _maxWords = maxWords;
    }
	
    //这个方法就是实现的接口方法
    //可以一次返回多个类型验证（返回多个规则）
    public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
    {
        //创建一个验证规则
        var rule = new ModelClientValidationRule();
        //错误提示
        rule.ErrorMessage = FormatErrorMessage(metadata == null ? null : metadata.GetDisplayName());
        //集中存放客户端需要参数，可以放置多个参数
        rule.ValidationParameters.Add("wordcount", _maxWords);
        //标识客户端需要额外的一段JavaScript
        rule.ValidationType = "maxwords";
        yield return rule;
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        //value 即表示输入的值，若输入不为空，则进行验证单词长度
        //否则返回Success，表示验证通过
        if (value != null)
        {
            var valueAsString = value.ToString();
            //计算单词数
            if (valueAsString.Split(' ').Length > _maxWords)
            {
                //DisplayName表示当前正在验证的字段名，用来格式化错误信息（{0}的占位）
                var errorMessage = FormatErrorMessage(validationContext == null ? null : validationContext.DisplayName);
                //返回格式化后的错误信息
                return new ValidationResult(errorMessage);

                //也可以指定返回固定字符串（但是这么做不灵活，而且也不支持多语言）
                //return new ValidationResult("Too many words.");
            }
        }
        return ValidationResult.Success;
    }
}
```

然后前端渲染后，Title字段的输入框，将会多出两个属性，这表示我们添加的前端验证规则生效了

后端模型

```CSharp
[Required(ErrorMessage = "This filed is required")]
[MaxLength(160,ErrorMessage ="the field {0} must be a string with a maximum length of 160.")]
[MaxWords(10)]
public string Title { get; set; }
```

前端渲染界面

```html
<input class="form-control text-box single-line" data-val="true" data-val-maxlength="the field Title must be a string with a maximum length of 160." data-val-maxlength-max="160" data-val-maxwords="Title has too many words." data-val-maxwords-wordcount="10" data-val-required="This filed is required" id="Title" name="Title" type="text" value="" style="">
```

其中`data-val-maxwords`与`data-val-maxwords-wordcount`就是根据代码返回的验证规则新增的

其后，我们还需要一些验证逻辑，才能使这两个验证规则生效，当填写了错误信息，才会触发阻止提交。

新增`JavaScript`，`/Scripts/App/CustomValidators.js`

```javascript
//适配器：帮助data-val检索值将数据转为jQuery验证可以理解的格式
//第一个参数：适配器名称（与服务端设置ValidationProperty一样），第二个参数：ValidationParameters的参数名称
$.validator.unobtrusive.adapters.addSingleVal("maxwords", "wordcount");
//验证规则(验证器)“addMethod表示添加新验证器”
//验证器名称：maxwords适配ValidationType属性值
$.validator.addMethod("maxwords", function (value, element, maxwords) {
    //value:输入值，element:参数输入元素，maxwords:所有验证参数
    if (value) {
        if (value.split(' ').length > maxwords) {
            return false;
        }
    }
    return true;
});
```

<center>适配器方法</center>
| 名称           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `addBool`      | 启用或禁用验证规则创建适配器，规则不需要额外参数             |
| `addSingleVal` | 为需要从元数据中检索唯一参数值的验证规则创建适配器           |
| `addMinMax`    | 创建一个验证规则集适配器，一个检查最小值，一个检测最大值，两个规则中至少有一个要依靠得到的数据运行 |
| `Add`          | 创建一个不适合前面类别的适配器，需要额外参数、设置额外代码   |

### 使用jQuery UI

在实际使用中，为了提升用户体验，我们通常会在`web`项目中添加一些动画效果

比如下面的代码

```javascript
$(function () {
    $("#btn").mouseover(function () {
        $(this).animate({ height: "+=25", width: "+=25" }).
            animate({ height: "-=25", width: "-=25" });
    });
});
```

对应的示例

![](https://i.imgur.com/WiOAie6.gif)

对于上面的这种动画，我们可以使用`jQuery UI`更快的实现，步骤如下：

+ 安装`jQuery UI`相关的包

  ```bash
  Install-Package jQuery.UI.Combined
  ```

+ 然后我们引入到项目中，如果一个项目太多页面需要使用，我们就可以放置在`_Layout.cshtml`中，引用一次，使用多次

  _Layout.cshtml

  ```html
  <html>
      <body>
          ...
      <div class="container body-content">
          @RenderBody()
          <hr />
          <footer>
              <p>&copy; @DateTime.Now.Year - 我的 ASP.NET 应用程序</p>
          </footer>
      </div>
  
      @Scripts.Render("~/bundles/jquery")
      @Scripts.Render("~/bundles/bootstrap")
      <!--引入jQuery UI-->
      <script src="~/Scripts/jquery-ui-1.12.1.min.js"></script>
      @RenderSection("scripts", required: false)
      </body>
  </html>
  ```

  或者使用下面这种方式引入，方便更新

  _Layout.cshtml

  ```html
  <html>
      <body>
          ...
      <div class="container body-content">
          @RenderBody()
          <hr />
          <footer>
              <p>&copy; @DateTime.Now.Year - 我的 ASP.NET 应用程序</p>
          </footer>
      </div>
  
      @Scripts.Render("~/bundles/jquery")
      @Scripts.Render("~/bundles/bootstrap")
      <!--不使用这种方式-->
      @*<script src="~/Scripts/jquery-ui-1.12.1.min.js"></script>*@
      <!--引入jQuery UI-->
  	@Scripts.Render("~/bundles/jqueryui")
      @RenderSection("scripts", required: false)
      </body>
  </html>
  ```

  /App_Start/BundleConfig.cs

  ```CSharp
  //添加一个新的关于jQueryUI的引用
  bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
      "~/Scripts/jquery-ui-{version}.js"));
  ```

+ 现在可以更简单的实现按钮覆盖的动画效果

  ```javascript
  $(function () {
      $("#btn").mouseover(function () {
          $(this).effect("bounce");
      });
  });
  
  ```

  示例

  ![](https://i.imgur.com/9fgdrL7.gif)

  还可以调整参数，例如动画执行时间，跳动范围

  ```javascript
  $(function () {
      $("#dailydeal a").mouseover(function () {
          $(this).effect("bounce", {time:3,distance:40});
      });
  });
  ```

  示例（可以看到，它的跳动范围更大一些）

  ![](https://i.imgur.com/nxF7PuT.gif)

### 使用jQuery UI完成搜索功能

示例中的搜索，我们可以使用`jQuery UI`来实现用户输入文本时，提示一部分内容给用户，用户点击，则会输入到输入框

+ 首先需要引入`jQuery UI.css`，`_Layout.cshtml`

  ```html
  <!DOCTYPE html>
  <html>
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>@ViewBag.Title - 我的 ASP.NET 应用程序</title>
          @Styles.Render("~/Content/css")
          @Scripts.Render("~/bundles/modernizr")
  	    <!--引入基础的css-->
          <link href="~/Content/themes/base/jquery-ui.css" rel="stylesheet" />
      </head>
      ...
  </html>
  ```

+ 绑定`autocomplete`属性绑定到`input`标签上

  ```html
  <div class="panel panel-default">
      <div class="panel-heading">Artist search</div>
      <div class="panel-body">
  
          @using (Ajax.BeginForm("ArtistSearch", "StoreManager",
              new AjaxOptions
              {
                  InsertionMode = InsertionMode.Replace,
                  HttpMethod = "GET",
                  OnFailure = "searchFailed",
                  LoadingElementId = "ajax-loader",
                  UpdateTargetId = "searchresults",
              }))
          {
          	<!--绑定自动完成数据源，数据通过QuickSearch提供-->
              <input type="text" name="q" data-autocomplete-source="@Url.Action("QuickSearch","StoreManager")" />
              <input type="submit" value="search" />
              <i id="ajax-loader" class="glyphicon glyphicon-transfer" style="display:none"></i>
          }
          <div id="searchresults"></div>
      </div>
  </div>
  ```

+ 实现后端返回数据源`StoreManagerController.cs`

  ```CSharp
  //通过每次输入的数据查询类似的数据
  [HttpGet]
  public ActionResult QuickSearch(string term)
  {
      var list = GetResultList(term).Select(c => new { value = c });
      return Json(list, JsonRequestBehavior.AllowGet);
  }
  
  //模拟数据源
  public static List<string> GetResultList (string term)
  {
      List<string> list = new List<string>();
      list.Add("Bob");
      list.Add("Ann");
      list.Add("Jack");
      list.Add("Anna");
      list.Add("Devide");
      list.Add("Oscar");
      list.Add("Ken");
      return list.Where(c => c.Contains(term)).ToList();
  }
  ```

+ 当页面初始化的时候，绑定相关的数据源

  ```javascript
  $(function () {
      $("#dailydeal a").mouseover(function () {
          $(this).effect("bounce", { time: 3, distance: 40 });
      });
  	//绑定自动完成提示选项，将从data-autocomplete-source中遍历数据，并实现自动完成插件
      $("input[data-autocomplete-source]").each(function () {
          var target = $(this);
          target.autocomplete({ source: target.attr("data-autocomplete-source") });
      });
  });
  ```

+ 实现示例

  ![](https://i.imgur.com/fn8y2iJ.gif)

### 使用模板

JavaScript有许多的模板，我们可以使用模板来组装数据，让代码更清晰、易读。其实模板与`Razor`语言类似，通常使用固定的符号分割，渲染数据，以下是示例：<u>通过搜索请求，根据返回的`JSON`数据渲染模板。</u>

+ 添加模板`mustache.js`引用

  ```
  Install-Package mustache.js
  ```

+ 引用模板脚本，`_Layout.cshtml`

  ```html
  <html>
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>@ViewBag.Title - 我的 ASP.NET 应用程序</title>
          @Styles.Render("~/Content/css")
          @Scripts.Render("~/bundles/modernizr")
          <link href="~/Content/themes/base/jquery-ui.css" rel="stylesheet" />
          @* 添加模板脚本 *@
          <script src="~/Scripts/mustache.js"></script>
      </head>
  </html>
  ```

+ 然后我们可以不使用`Ajax`辅助方法，自己编写`JavaScript`代码来向服务器请求HTML

  ```javascript
  $("#artistSearch").submit(function (event) {
      //阻止点击submit发送提交的默认行为，改为使用load
      event.preventDefault();
      //获取当前整个form表单
      var form = $(this);
      //将form序列化，提取其中的值，例如表单外面只有一个输入框"q"，输入123提交
      //那么输入的值将会以"q=123"这种格式提交
      //load()接收两个参数，前者是form表单中的action地址，后者就是q=123，将会被提交到后台
      $("#searchresults").load(form.attr("action"), form.serialize());
  });
  ```

  进行到这里，当我们点击`search`时，还是使用的部分视图，需要继续修改

+ 然后将之前代码返回的部分视图改为返回`JSON`格式的字符串

  ```CSharp
  [HttpGet]
  public ActionResult ArtistSearch(string q)
  {
      Thread.Sleep(3000);
      var list = GetResultList(q);
      return Json(list, JsonRequestBehavior.AllowGet);
      //return PartialView("_Result", list);
  }
  
  public static List<Student> GetResultList(string term)
  {
      List<Student> list = new List<Student>();
      list.Add(new Student { Name = "Bob" });
      list.Add(new Student { Name = "Ann" });
      list.Add(new Student { Name = "Jack" });
      list.Add(new Student { Name = "Anna" });
      list.Add(new Student { Name = "Devide" });
      list.Add(new Student { Name = "Oscar" });
      list.Add(new Student { Name = "Ken" });
      return list.Where(c => c.Name.Contains(term)).ToList();
  }
  
  public class Student
  {
      public string Name { get; set; }
      public int Age { get; set; }
  }
  ```

+ 然后，需要修改`load()`方法为`getJSON()`，然后将返回的消息通过模板生成html，渲染到指定的位置

  `getJSON()`方法可以接收`JSON`格式的数据

  ```javascript
  $("#artistSearch").submit(function (event) {
      //阻止点击submit发送提交的默认行为，改为使用load
      event.preventDefault();
      //获取当前整个form表单
      var form = $(this);
      //将form序列化，提取其中的值，例如表单外面只有一个输入框"q"，输入123提交
      //那么输入的值将会以"q=123"这种格式提交
      //load()接收两个参数，前者是form表单中的action地址，后者就是q=123，将会被提交到后台
      //$("#searchresults").load(form.attr("action"), form.serialize());
  
      //发送get请求，接收json格式数据
      $.getJSON(form.attr("action"), form.serialize(), function (data) {
  		//将使用mustache，传入模板，数据，生成html
          var html = Mustache.to_html($("#artistTemplate").html(), { artists: data });
          //放入searchresults中
          $("#searchresults").empty().append(html);
      });
  });
  ```

+ 当然，不能忘记最重要的一点，模板

  ```html
  <form>
      ...
  </form>
  
  <script id="artistTemplate" type="text/html">
  	<ul>
  		//表示artists是一个可遍历的集合，类似于foreach
          {{#artists}}
              //取artists中每个元素的Name属性,Age属性
              <li>{{Name}}:{{Age}}</li>
      	{{/artists}}
      </ul>
  </script>
  ```

+ 然后可以看一下效果

  ![](https://i.imgur.com/vWLHERd.gif)

+ 示例还有一个问题，没有加载效果，因为我们是自己实现的请求，`form`表单，这没有`Ajax`辅助方法方便，不过我们可以实现它，使用`jQuery`的`ajax`方法：最大限度的灵活性，修改渲染的提交方法

  ```javascript
  $("#artistSearch").submit(function (event) {
      //阻止点击submit发送提交的默认行为，改为使用load
      event.preventDefault();
      //获取当前整个form表单
      var form = $(this);
      //将form序列化，提取其中的值，例如表单外面只有一个输入框"q"，输入123提交
      //那么输入的值将会以"q=123"这种格式提交
      //load()接收两个参数，前者是form表单中的action地址，后者就是q=123，将会被提交到后台
      //$("#searchresults").load(form.attr("action"), form.serialize());
  
      ////发送get请求，接收json格式数据
      //$.getJSON(form.attr("action"), form.serialize(), function (data) {
      //    //将使用mustache，传入模板，数据，生成html
      //    var html = Mustache.to_html($("#artistTemplate").html(), { artists: data });
      //    //放入searchresults中
      //    $("#searchresults").empty().append(html);
      //});
      
       $.ajax({
          url: form.attr("action"),
          data: form.serialize(),
          //请求前显示图标
          beforeSend: function () {
              $("#ajax-loader").show(),
          },
          //请求后隐藏图标
          complete: function () {
              $("#ajax-loader").hide(),
          },
          //请求出错，执行方法
          error: searchFailed,
          //请求成功，渲染模板
          success: function (data) {
              //将使用mustache，传入模板，数据，生成html
              var html = Mustache.to_html($("#artistTemplate").html(), { artists: data });
              //放入searchresults中
              $("#searchresults").empty().append(html);
          }
      })
  });
  ```

+ 再来看看效果（多了一个动画效果）

  ![](https://i.imgur.com/kEvBtzk.gif)

**结论：这与前面实现的Ajax辅助方法效果一样，为什么需要使用JSON格式的这种方式。因为前面使用部分视图，还是将整个HTML一起返回到前端的。而这种方法，就是将数据交给浏览器来渲染，减轻了服务器的压力。降低了带宽。**



## 书中建议

> 对于开发的时候，编写自定义脚本时，建议使用非侵入式方式（即：`js`代码与`html`代码分开），这样有助于代码更清晰，更易维护。
>
> 对于性能建立：书中看到几个，记录一下，后面应该可以用到：
>
> + 通过网上的一些网站性能分析工具，对网站内容，加载时间，总体评分来判断性能
>
> + 通过内容分发网络（CDN）来加载一些公共的`js`类库，减少自己的服务器压力，若CDN无法访问时，应该有备用的`js`，例如：`jQuery`，`bootstrap`
>
>   微软CDN脚本版本及列表：http://www.asp.net/ajaxlibrary/CDN.ashx
>
>   ```html
>   //双斜杠开头表示（网络路径参考），当我们不确定是https的资源路径时，如果我们固定使用了http，那么将会被浏览器提示混合内容警告，所以使用"//"更方便些
>   <script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js" type="text/javascript"></script>
>   ```
>
> + 脚本优化，将大型的`script`引用放置于页面底部，待页面加载`html`后，再加载，提升网页响应速度
>
> + 使用`BundleConfig.cs`，它可以将多个脚本压缩成一个，缩小文件大小，减少请求次数，缩短页面加载时间
>
>   `/App_Start/BundleConfig.cs`
>
>   ```cs
>   public class BundleConfig
>   {
>       public static void RegisterBundles(BundleCollection bundles)
>       {
>           bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
>               "~/Scripts/jquery-{version}.js"));
>   
>           bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
>               "~/Scripts/jquery.validate*"));
>   
>           bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
>               "~/Scripts/modernizr-*"));
>   
>           bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
>               "~/Scripts/bootstrap.js",
>               "~/Scripts/respond.js"));
>   
>           bundles.Add(new StyleBundle("~/Content/css").Include(
>               "~/Content/bootstrap.css",
>               "~/Content/site.css"));
>   
>           bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
>               "~/Scripts/jquery-ui-{version}.js"));
>       }
>   }
>   ```
>
>   使用示例：`_Layout.cshtml`
>
>   ```html
>   <!DOCTYPE html>
>   <html>
>       <head>
>           <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
>           <meta charset="utf-8" />
>           <meta name="viewport" content="width=device-width, initial-scale=1.0">
>           <title>@ViewBag.Title - 我的 ASP.NET 应用程序</title>
>           @Styles.Render("~/Content/css")
>           @Scripts.Render("~/bundles/modernizr")
>           <link href="~/Content/themes/base/jquery-ui.css" rel="stylesheet" />
>           @* 添加模板脚本 *@
>           <script src="~/Scripts/mustache.js"></script>
>       </head>
>       <body>
>           ...
>           @Scripts.Render("~/bundles/jquery")
>           @Scripts.Render("~/bundles/bootstrap")
>           @*<script src="~/Scripts/jquery-ui-1.12.1.min.js"></script>*@
>           @Scripts.Render("~/bundles/jqueryui")
>           @RenderSection("scripts", required: false)
>       </body>
>   </html>
>   ```
>
> + 当我们将`web.config`中的配置改为`debug`模式，`js`如果是灵活引用，就会引用未压缩版，其中源码我们可以读懂
>
> + 当将`web.config`中配置改为`release`模式，js就会自动引用`*.min.js`，减少带宽，减少服务器压力，加快页面加载速度
>
>   ```CSharp
>   //*表示可以跟任意字符，可以根据配置，自动加载*.min.js 还是 *.js
>   bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
>       "~/Scripts/jquery.validate*"));
>   ```
>
>   ![](https://i.imgur.com/Z2IWa3M.png)





