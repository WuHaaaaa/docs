---
title: 数据注解，验证
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---

## 前言

> 在工作中遇到了太多关于MVC的问题，之前没有系统的学习过，现在趁闲暇时间好好吸收一些不熟悉的知识。第三章：数据注解，验证

<!-- more -->

## 正文

### Required

设置了该特性后，当提交的时候，若指定了该特性的字段为空，则会提示，不允许为空。

后端

```CSharp
public class Order
{
    public int OrderId { get; set; }
    public DateTime OrderDate{ get; set; }
    public string UserName { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    //...
}
```

界面展示

![](https://i.imgur.com/jR75l1V.png)

### StringLength

限制输入字符串长度，若属性设置了该特性，则在提交时，就会提示

Order.cs

```CSharp
public class Order
{
    public int OrderId { get; set; }
    public DateTime OrderDate{ get; set; }
    public string UserName { get; set; }

    [Required]
    [StringLength(20)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(20)]
    public string LastName { get; set; }
	//..
}
```

显示

![](https://i.imgur.com/ft76EGS.png)

我们还可以进一步限制字符串长度，可以通过`MinimumLength`设置

```CSharp
public class Order
{
    public int OrderId { get; set; }
    public DateTime OrderDate{ get; set; }
    public string UserName { get; set; }

    [Required]
    [StringLength(20,MinimumLength = 3)]
    public string FirstName { get; set; }
    //..
}
```

显示

![](https://i.imgur.com/VFd4T7t.png)

### RegularExpression

正则表达式验证；对于需要其他格式，例如邮箱格式，手机号码格式，可以使用这个特性。当然，需要匹配相应的正则表达式

限制用户在输入`Email`时，只能输入邮箱格式

```CSharp
//验证是否是邮箱格式
[RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}")]
public string Email { get; set; }
```

显示，当用户输入时，若不是邮箱格式，则会提示。若用户不输入任何字符，则不会提示。当然，提示内容还有待改进。

![](https://i.imgur.com/GARnhDx.png)

### Range

对于数字输入来说，这个特性可以限制数字最小，最大值，例如：年龄

**它可以用于`int`类型，也可以用于`double`类型。它另外一个版本，可以传入Type类型参数，这使它可以限制`Date`和`Decimal`的范围**

```CSharp
//设置特性，限制输入Age字段的值在18-90之间
[Range(18, 90)]
public int Age { get; set; }
```

显示

前端会字段将该字段类型设置为数字类型，可以通过右边的箭头设置值

![](https://i.imgur.com/LPHxeps.png)

我们还可以进一步的设置金额的范围

```CSharp
public class Order
{
    public int OrderId { get; set; }
    //设置金额在指定范围内
    [Range(typeof(decimal), "0.00", "19.99")]
    public double Price { get; set; }

    //设置年龄在指定范围
    [Range(18, 90)]
    public int Age { get; set; }           
}
```

显示，但是它右边没有数字的快捷键

![](https://i.imgur.com/AThRQmI.png)

### Compare

用于验证邮箱或密码输入是否正确。当然，也可以验证其他两次输入值

```CSharp
//验证是否是邮箱格式
[RegularExpression(@"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}")]
public string Email { get; set; }

//验证两次输入邮箱是否正确
[Compare("Email")]
public string ConfirmEmail { get; set; }
```

显示，当两次输入邮箱格式不正确时，就会提示输入的不匹配

![](https://i.imgur.com/5y0xtyC.png)

### Remote

可以调用服务器端的验证，例如：**前端验证某个用户输入的用户名是否已经存在**，这种情况，前端是无法独立验证的。这时候就需要后端去查询数据库，进行验证，然后返回到前端

```CSharp
//接收两个参数，分别是action与controller
[Remote("CheckUserName", "Orders")]
public string UserName { get; set; }
```

在`OrdersController.cs`中添加验证方法

```CSharp
[HttpGet]
public JsonResult CheckUserName(string username)
{
    //从orders中尝试查找与输入用户名相同的数据
    var result = db.Orders.Where(c => c.UserName == username).Count() == 0;
    //返回true or false
    return Json(result, JsonRequestBehavior.AllowGet);
}
```

前端需要引用相应的`js`，否则验证不会生效，`Create.cshtml`

```html
<script src="~/Scripts/jquery.validate.min.js"></script>
<script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
```

若`BundleConfig.cs`添加了相应的引用

```CSharp
// For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
public static void RegisterBundles(BundleCollection bundles)
{
    bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
        "~/Scripts/jquery-{version}.js"));
	
    //这个就是上面对应的引用
    bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
        "~/Scripts/jquery.validate*"));
}
```

我们可以在前端省略一下，`Create.cshtml`

```html
@Scripts.Render("~/bundles/jqueryval")
```

显示，在之前，已经有了相同的用户名`ruahip`，当我再次添加同样的用户名，则会提示无效。当然，我们也可以自定义错误信息

![](https://i.imgur.com/DnL1Nx4.png)

### 自定义错误提示消息

我们可以设置每个特性错误后的提示消息，`ErrorMessage`

```CSharp
[Remote("CheckUserName", "Orders",ErrorMessage ="用户名已存在，请尝试其他用户名")]
public string UserName { get; set; }

[Required(ErrorMessage = "名字不能为空")]
[StringLength(20, MinimumLength = 3,ErrorMessage = "字段最短不少于3个字符，最多不超过20个字符")]
public string FirstName { get; set; }
```

当出现了验证，它就会将我们设置的错误信息展示出来

![](https://i.imgur.com/yojVyZV.png)

还可以将字段名称显示出来，这样对用户来说，更有标识性，用`{0}`占位，可以显示字段名称

```CSharp
[Remote("CheckUserName", "Orders",ErrorMessage ="{0}已存在，请尝试其他{0}")]
public string UserName { get; set; }

[Required(ErrorMessage = "{0}不能为空")]
[StringLength(20, MinimumLength = 3,ErrorMessage = "{0}最短不少于3个字符，最多不超过20个字符")]
public string FirstName { get; set; }
```

显示

![](https://i.imgur.com/Fz4ta8V.png)

如果程序支持多语言时，这种指错误提示的方法，就比较不合适，所以需要采取其他方式

`ErrorMessages.resx`是一个资源文件，其中包含`UserNameRepeat`相对应的翻译提示，例如：

| 指定键           | 说明                   |
| ---------------- | ---------------------- |
| `UserNameRepeat` | 用户名重复，请重新输入 |

当换成英文系统后，`ErrorMessage-en-Us.resx`将会生效，其中包含的是另外的翻译提示，例如：

| 指定键           | 说明                                 |
| ---------------- | ------------------------------------ |
| `UserNameRepeat` | User Name is Repeat,Please try again |

```CSharp

[Remote("CheckUserName", "Orders", ErrorMessageResourceType = typeof(ErrorMessages),
        ErrorMessageResourceName = "UserNameRepeat")]
public string UserName { get; set; }
```

### 查看特定的错误提示消息

如果用户在提交表单的时候，没有输入`UserName`字段的值，则会触发后台验证，这时候我们可以查看其出现的错误

```CSharp
var usernameErrorMessage = ModelState["UserName"].Errors[0].ErrorMessage;
```

### 自定义验证逻辑

ASP.NET 的这些错误验证也有一部分的局限性，当遇到这些特性无法解决的时候，就需要我们自定义验证逻辑，验证逻辑有两个核心的应用方法：

+ 将验证逻辑封装在自定义的数据注解中

  这种好处是，完成一个注解，可以在多个模型中重用，但是需要判断不同类型的模型

+ 将验证逻辑直接封装在模型对象中

  这种的好处是，只考虑应用当前注解的模型，而不用考虑其他，实现起来更简单，但是不利于重用

#### 封装在自定义数据注解中

新建一个类，`MaxWordsAttribute.cs`

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
                var errorMessage = FormatErrorMessage(validationContext.DisplayName);
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

然后我们可以在`Order.cs`中使用它。而且它完好的支持自定义错误信息、默认错误信息以及多语言

```CSharp
[Required]
[StringLength(160)]
//最大单词数不超过10个，使用默认错误信息
[MaxWords(10)]
public string LastName { get; set; }

//最大单词数不超过10个，使用自定义错误信息
[MaxWords(10, ErrorMessage = "There are too many words in {0}")]
public string Address { get; set; }

//最大单词数不超过10个，使用多语言支持（截图中未出现，需要其他资源文件、代码，还没有研究到那里，代码倒是可以这么写，不过界面上会报错，可以先把这个特性注释）
[MaxWords(10, ErrorMessageResourceType = typeof(ErrorMessages),
          ErrorMessageResourceName = "CityMaxWord")]
public string City { get; set; }
```

显示（前端还是需要引用哪个验证的`js`，否则不会生效），`Create.cshtml`

**引用`js`，需要在代码之前，若在`_layout.cshtml`中引用，则应该在`@RenderBody()`之前，否则js也不会生效**

```html
@Scripts.Render("~/bundles/jqueryval")
<!--或者-->
<script src="~/Scripts/jquery.validate.min.js"></script>
<script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
```

![](https://i.imgur.com/i1FpUiw.png)

#### 封装在模型对象中

这种模式，可以直接在`Model`中操作

> 这种方式，对于模型中，有多个属性比较时，会更适合

```CSharp
//继承并实现一个接口
public class Order : IValidatableObject
{    
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (LastName != null && LastName.Split(' ').Length  > 10)
        {
            //后一个参数是一个数组，可以传入多个属性与结果关联，到时候会显示多个属性的提示
            yield return new ValidationResult("The Last name has too many words!", new[] { "LastName" });
        }
    }
}
```

显示，在所有的验证都通过后，才会验证该字段

![](https://i.imgur.com/CjLzEbt.png)

### 显示和编辑注解

在填写表单时，我们可能会有修改字段本身显示的需求，例如：`UserName`，我可能想显示为`用户名`，这时候，我们就需要其他的一些特性来渲染表单，让它生成为我们更需要的格式

### Display

通过这个特性，可以随心所欲的修改显示字段为我们想要的

```CSharp
[Remote("CheckUserName", "Orders", ErrorMessage = "{0}已存在，请尝试其他{0}")]
[Display(Name = "用户名")]
public string UserName { get; set; }

[Required(ErrorMessage = "{0}不能为空")]
[StringLength(20, MinimumLength = 3,ErrorMessage = "{0}最短不少于3个字符，最多不超过20个字符")]
[Display(Name = "First Name")]
public string FirstName { get; set; }
```

显示

![](https://i.imgur.com/JDOXZNc.png)

通过这个特性，我们也可以对它进行排序，前端就会按照我们排序来显示，不过它只对自动生成的`Model`生效，若手动排序，则不会有效果，`Order`属性设置越小，排序越靠前，默认`10000`

```CSharp
[Remote("CheckUserName", "Orders", ErrorMessage = "{0}已存在，请尝试其他{0}")]
[Display(Name = "用户名",Order =10000)]
public string UserName { get; set; }

[Required(ErrorMessage = "{0}不能为空")]
[StringLength(20, MinimumLength = 3,ErrorMessage = "{0}最短不少于3个字符，最多不超过20个字符")]
[Display(Name = "First Name",Order = 15001)]
public string FirstName { get; set; }

[Required]
[StringLength(160)]
[Display(Name ="Last Name",Order = 15000)]
//[MaxWords(10)]
public string LastName { get; set; }
```

手动（这种情况，顺序将不会有任何改变）

```html
<div class="form-group">
    @Html.LabelFor(model => model.UserName, htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        @Html.EditorFor(model => model.UserName, new { htmlAttributes = new { @class = "form-control" } })
        @Html.ValidationMessageFor(model => model.UserName, "", new { @class = "text-danger" })
    </div>
</div>

<div class="form-group">
    @Html.LabelFor(model => model.FirstName, htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        @Html.EditorFor(model => model.FirstName, new { htmlAttributes = new { @class = "form-control" } })
        @Html.ValidationMessageFor(model => model.FirstName, "", new { @class = "text-danger" })
    </div>
</div>

<div class="form-group">
    @Html.LabelFor(model => model.LastName, htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        @Html.EditorFor(model => model.LastName, new { htmlAttributes = new { @class = "form-control" } })
        @Html.ValidationMessageFor(model => model.LastName, "", new { @class = "text-danger" })
    </div>
</div>
```

![](https://i.imgur.com/GALTgG5.png)

自动（会生效，但是样式不好看）

```html
@using (Html.BeginForm())
{
@Html.AntiForgeryToken()

<div class="form-horizontal">
    <h4>Order</h4>
    <hr />
    @Html.ValidationSummary(true, "", new { @class = "text-danger" })
	
    <!--自动生成表单-->
    @Html.EditorForModel()

    <div class="form-group">
        <div class="col-md-offset-2 col-md-10">
            <input type="submit" value="Create" class="btn btn-default" />
        </div>
    </div>
</div>
}
```

![](https://i.imgur.com/7cEeGJK.png)

### ScaffoldColumn

可以隐藏一些HTML辅助方法（如：`EditForModel`和`DisplayForModel`渲染的表单）

这个特性对于**非`EditForModel`自动渲染**的界面，将不会生效

```CSharp
[Remote("CheckUserName", "Orders", ErrorMessage = "{0}已存在，请尝试其他{0}")]
[Display(Name = "用户名",Order =10000)]
[ScaffoldColumn(false)]
public string UserName { get; set; }
```

前端使用`EditForModel`渲染

```html
@using (Html.BeginForm())
{
@Html.AntiForgeryToken()

<div class="form-horizontal">
    <h4>Order</h4>
    <hr />
    @Html.ValidationSummary(true, "", new { @class = "text-danger" })

    <!--自动生成表单-->
    @Html.EditorForModel()

    <div class="form-group">
        <div class="col-md-offset-2 col-md-10">
            <input type="submit" value="Create" class="btn btn-default" />
        </div>
    </div>
</div>
}
```

显示

![](https://i.imgur.com/IJlTPAw.png)

这个特性对于**非`EditForModel`自动渲染**的界面，将不会生效

`UserName`还是在表单中

![](https://i.imgur.com/wv7ZiAd.png)

### DisplayFormat

格式化输入元素

```CSharp
//ApplyFormatInEditMode 默认值为False，因为若不为false，又没有设置格式化值，提交的时候将会把‘$’这种符号一并提交
[DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
public decimal Total { get; set; }
```

显示（在渲染为列表的时候就会自动加上货币符号）

![](https://i.imgur.com/qqemD5h.png)

当编辑的时候，会自动加上，新增的时候没有（不知道为什么）

![](https://i.imgur.com/HrwvDRw.png)

### ReadOnly

为表单某字段加上只读属性，这个特性只有后端模型绑定器会对这个进行验证，前端还是会生成一个可输入文本框

```CSharp
[ReadOnly(true)]
public decimal Total { get; set; }
```

显示，若编辑，提交后，这个字段将赋值为`0.00`

编辑前

![](https://i.imgur.com/A68gdN7.png)

提交编辑后

![](https://i.imgur.com/tnA0j1X.png)

若想前端显示`Readonly`，需要在前端设置

```html
<div class="form-group">
    @Html.LabelFor(model => model.Total, htmlAttributes: new { @class = "control-label col-md-2" })
    <div class="col-md-10">
        <!--添加Readonly属性-->
        @Html.EditorFor(model => model.Total, new { htmlAttributes = new { @class = "form-control", @Readonly="Readonly" } })
        @Html.ValidationMessageFor(model => model.Total, "", new { @class = "text-danger" })
    </div>
</div>
```

显示

![](https://i.imgur.com/LTqxRLA.png)

### DataType

该特性可以提供属性的特定用途，例如密码、邮箱、URL、货币、日期、时间、多行文本

```CSharp
//设置日期在指定范围内
[Range(typeof(DateTime), "2000-01-01 00:00:00", "2099-12-31 23:59:59")]
[DataType(DataType.Date)]
public DateTime OrderDate { get; set; }
```

显示（这样，当显示的时候就是一个日期拾取器，而且可以验证数据范围）

![](https://i.imgur.com/VCgLWks.png)

### HiddenInput

```CSharp
//隐藏输入表单元素，前端不会显示
//需要引用System.Web.Mvc
[HiddenInput(DisplayValue =true)]
public int Age { get; set; }
```

显示

![](https://i.imgur.com/4ENzIpe.png)

其实只是将`type`设置了`hidden`属性

```html
<input class="form-control" data-val="true" data-val-number="字段 Age 必须是一个数字。" data-val-required="Age 字段是必需的。" id="Age" name="Age" type="hidden" value="">
```

## 完结

又看完了一部分，撒花，收获挺多的

