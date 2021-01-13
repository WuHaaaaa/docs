---
title: 安全性、权限验证、角色成员分配
date: 2020-10-24
categories:
 - 后端
tags:
 - .NET MVC
 - MVC5 自学
author: Ruan
---
## 前言

> 这一章，对应的是书上的第七章，主要讲述安全性、权限验证、角色成员分配等，这些也是常用`web`系统所需要的，需要好好看看

<!-- more -->

## 本章总结

这是本书作者在本章开头写下的，我认为这些很有用，记录一下

> **永远都不要相信用户提供的任何数据**
>
> 下面是一些实际的例子：
>
> + 每当渲染作为用户输入而引入的数据时，请对其进行编码，最常见的做法是使用`HTML`编码。但是，如果数据作为特性值显示，就应对其进行`HTML`特性编码；如果数据用在`JavaScript`代码段中，就应该对其进行`JavaScript`编码。有些时候，需要进行多层编码，如`HTML`页面中的`JavaScript`代码段
> + 考虑好网站的哪些部分允许匿名访问，哪些部分要求认证访问
> + 不要试图自己净化用户的`HTML`输入（使用正则表达式或其他方法）——否则就会失败。
> + 在不需要通过客户端脚本（大部分情况下）访问`cookie`时，使用`Http-only cookie`。
> + 请记住，外部输入不只是显示的表单域，还包括`URL`查询字符串、隐藏表单域、`Ajax`请求以及我们使用的外部`Web`服务结果等。
> + 建议使用`AntiXSS`编码器（这是`Microsoft Web Protection Library`的一个组件，`ASP.NET 4.5`及更高的版本自带该库。

## Authorize

通过这个特性，我们可以设置有关权限验证的页面，只有当用户登陆后，才能访问

```CSharp
//比如一个购买页面，我们需要验证身份
[Authorize]
public ActionResult Buy(int id)
{
    var album = GetAlbums().Single(a => a.AlbumId == id);

    //Charge the user and ship the album!!!
    return View(album);
}
```

当我们点击Buy时，它会验证当前用户是否已登录，然后判断，若未登录，则会重定向到登录页，若已登录，则继续进行下面的操作。

## 注册全局过滤器

一般情况下，我们开发的网站，大多地方需要登陆后浏览，所以我们为了节省我们的开发，也为了方便（若按照上面`Authorize`特性的方式，每个方法都要添加`Authorize`，不得累死），我们就需要注册全局的权限验证过滤器，然后通过`AllowAnonymous`特性，允许一部分的控制器，可以在不登录时访问

注册全局过滤器，`FilterConfig.cs`

```CSharp
public static void RegisterGlobalFilters(GlobalFilterCollection filters)
{
    filters.Add(new HandleErrorAttribute());
    //新注册的全局过滤器
    filters.Add(new System.Web.Mvc.AuthorizeAttribute());
}
```

允许一部分控制器不登录，即可访问，`AccountController.cs`

```CSharp
// GET: /Account/Login
[AllowAnonymous]
public ActionResult Login(string returnUrl)
{
    ViewBag.ReturnUrl = returnUrl;
    return View();
}

//
// POST: /Account/Login
[HttpPost]
[AllowAnonymous]
[ValidateAntiForgeryToken]
public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
{
    if (!ModelState.IsValid)
    {
        return View(model);
    }
    ...
}
```

## 阻止XSS（跨脚本攻击）

### 跨站脚本攻击分类

[图片参考：XSS(跨站脚本攻击)详解](https://blog.csdn.net/qq_36119192/article/details/82469035)

#### 被动注入

例如：用户评论时，加了一个`JavaScript`脚本，但是评论系统提交的时候，没有验证出来，导致其他用户访问当前页面时，该页面就会执行脚本

![img](https://i.imgur.com/ipQayvg.png)

#### 主动注入

黑客会在例如博客系统评论中添加恶意链接，用户点击后，跳到与该网站类似的网站，诱导用户输入关键信息

![img](https://i.imgur.com/OQ0wMw2.png)

### 第一种：对所有内容进行HTML编码

`Html.Encode()`：它会对页面内容进行编码，例如用户输入密码，用户名，将所有待编码字符编码

`Html.AttributeEncode()`：编码个别的几个字符`''`、`&`、`~`、`\`

```html
<!--Create-->
<h2>Create</h2>
Create
<!--Encode-->
@Html.Encode("<h2 class='qw3'> Create</h2>")<br />
&lt;h2 class=&#39;qw3&#39;&gt; Create&lt;/h2&gt;
<!--AttributeEncode:-->
@Html.AttributeEncode("<h2 class='qw3'> Create</h2>")
&lt;h2 class=&#39;qw3&#39;> Create&lt;/h2>
```

### 第二种：对`JavaScript`进行编码

`Ajax.JavaScriptStringEncode`：对使用字符串进行编码

```html
@Ajax.JavaScriptStringEncode("<script>Hello,world</script>")
\u003cscript\u003eHello,world\u003c/script\u003e
```

### 第三种，使用`AnitXSS`编码

`AnitXSS`编码，需要自己搜一下例子，大致也是对HTML进行编码，不过更加完善，而且有白名单、黑名单，针对关键字过滤

## 威胁：跨站请求伪造（CSRF，XSRF）

### 混淆代理

```CSharp
//当没有添加这两个属性，当程序中出现其他请求，将不会很好的验证
//[HttpPost]
//[ValidateAntiForgeryToken]
public ActionResult Logout()
{
	AuthenticationManager.SignOut();
    return RedirectToAction("Index","Home");
}
```

如果这时候，有用户在当前系统中发表了一个评论（假设这是一个博客系统），那么这时，用户输入下面的示例：

```html
<img src='/account/logout' />
```

当其他用户访问这个页面的时候，会触发程序请求`图片`，发出请求后，会导致程序退出（这就是所谓的混淆代理）

### 阻止CSRF攻击

#### 第一种：令牌验证

.NET MVC可以通过令牌验证，阻止CSRF攻击

```html
<form action="/xxx/xxx" method="post">
    @Html.AntiForgeryToken()
...
</form>
```

当渲染倒界面上，就会出现一个隐藏的`input`标签，用于提交表单时进行验证

```html
<form action="/xxx/xxx" method="post">
    <input type="hidden" value="46sfdgf5ds4g6dsfg">
...
</form>
```

后端也有相应的验证

```CSharp
[ValidateAntiforgeryToken]
public ActionResult Register() 
{ 
    //...
}
```

#### 第二种：HttpReferrer验证

通过refer防盗链来解决非当前站点提交

```CSharp
public class IsPostedFormThisSiteAttribute:AuthorizeAttribute
{
    public override void OnAuthorize(AuthorizationContext filterContext)
    {
        if(filterContext.HttpContext != null)
        {
            if (filterContext.HttpContext.Request.UrlReferrer == null)
            {
                throw new System.Web.HttpException("Invalid submission");
            }
            if (filterContext.HttpContext.Request.UrlReferrer.Host != "mysite.com")
            {
                throw new System.Web.HttpException("This form wasn't submitted from this site!");
            }
        }        
    }    
}
```

运用

```CSharp
[IsPostedFormThisSiteAttribute]
public ActionResult Register()
{
	//...
}
```

## 威胁：cookie盗窃

当黑客盗取了我们的cookie，他们便能通过cookie，登录我们登录过的网站，在里面搞破坏

### 禁止cookie盗窃：HttpOnly

在`web.config`中配置

这个配置会告知用户，除了服务器可以修改、设置cookie，其他一切对cookie的操作均无效。

```xml
<httpCookies domain="" httpOnlyCookies="treu" requireSSL="false" />
```

## 威胁：过多提交（Over-Posting）

在提交表单的时候，我们经常会隐藏一些字段不显示出来，让用户不填写，然后提交

但是如果有人恶意提交，例如下面的例子：我们这时候就需要`[Bind]`属性

```CSharp
//model
public class Review
{
    public int ReviewId{get;set;}
    public int ProductId{get;set;}
    public Product Product{get;set;}
    public string Name{get;set;}
    public string Comment{get;set;}
    public bool Approved{get;set;}
}
```

前端，我们只需要让用户填写`Name`和`Comment`两个字段值，于是我们前端只渲染两个

```html
Name:@Html.TextBox("Name") <br/>
Comment:@Html.TextBox("Comment")
```

这时候，正常用户可以按需要填写，但是如果是恶意用户，他可以提交`Approved=true`这种值，因为后端没有进行处理，或者他可以添加一个`Product.Price`属性，该变商品的价格

这时候就需要`[Bind]`出场了，它可以对我们想要的属性，进行验证、限制，有三种方式：

### 模型类中限制绑定

在模型类中，我们可以进行限制，指定我们需要的字段进行绑定，后端接收的时候，就只接收指定字段值

```CSharp
//model
[Bind(Include="Name","Comment")]
public class Review
{
    public int ReviewId{get;set;}
    public int ProductId{get;set;}
    public Product Product{get;set;}
    public string Name{get;set;}
    public string Comment{get;set;}
    public bool Approved{get;set;}
}
```

### 表单提交时绑定

```CSharp
public ActionResult Comment([Bind(Include="Name","Comment" Review review)])
{
	//...
}
```

或者这种绑定方式

```CSharp
public ActionResult Comment(Review review)])
{
	UpdateModel(review,"Review",new string[] {"Name", "Comment"});
    //...
}
```

### 直接指定视图模型

这种方式最简单，也方便修改，我们无需显示绑定，在视图中，我们创建一个`ReviewModel`模型，这样提交的时候，只需要两个字段即可，而且不需要验证，其他字段是无效的

```CSharp
//reviewModel
public class ReviewModel
{
    public string Name{get;set;}
    public string Comment{get;set;}
}
```

## 威胁：开放重定向攻击

开发重定向攻击，简单的描述就是：当我们访问一个页面的时候，若这时我们还未登录，会跳到登陆页，但是会在链接上添加一个`ReturnUrl`参数用于表示，当我们登录后，继续可以访问登录前，我们需要访问的页面

例如：我要访问`StoreManager`页面的时候，我事先未登录，这时候会要求我先登录。

![](https://i.imgur.com/INvHyYt.png)

当我登录成功，网站会引导我直接跳到`StoreManager`页面

![](https://i.imgur.com/aI9gucF.png)

这时候，黑客就可以对`ReturnUrl`下手了，步骤如下：

> 1. 如果他将页面重定向到一个十分类似的网站，并且提示用户，密码错误，重试。
> 2. 这时候不是很谨慎的用户，就会重新输入一次
> 3. 当用户再次输入后，恶意网站重定向又会将用户定向到正常页面，由于之前已经通过登录验证，这次用户可以直接浏览首页
> 4. 用户在不之情的情况下，被盗取了账号密码等信息

我们在开发的时候，怎么避免这种情况的发生呢？

后端验证重定向的时候，我们可以验证一下，当前重定向`URL`是否是本地的地址，这样就可以避免这个问题了，示例：

```CSharp
[HttpPost]
[AllowAnonymous]
[ValidateAntiForgeryToken]
public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
{
    if (!ModelState.IsValid)
    {
        return View(model);
    }
    // 这不会计入到为执行帐户锁定而统计的登录失败次数中
    // 若要在多次输入错误密码的情况下触发帐户锁定，请更改为 shouldLockout: true
    var result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: false);
    switch (result)
    {
        case SignInStatus.Success:
            //重定向到之前访问页，我们可以写一个方法判断一下
            return RedirectToLocal(returnUrl);
        case SignInStatus.LockedOut:
            return View("Lockout");
        case SignInStatus.RequiresVerification:
            return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
        case SignInStatus.Failure:
        default:
            ModelState.AddModelError("", "无效的登录尝试。");
            return View(model);
    }
}

//重定向判断
private ActionResult RedirectToLocal(string returnUrl)
{
    //使用这个方法，判断Url是否是本地的url，若是，则继续跳转
    if (Url.IsLocalUrl(returnUrl))
    {
        return Redirect(returnUrl);
    }
    //否则就跳转到首页，避免了跳转其他页面
    return RedirectToAction("Index", "Home");

    //或者我们可以提示用户，当用户要跳转至站外站点时
    //需要安装包，Elmah;
    //这个包可以将异常登录记录下来
    string message = string.Format("Open redirect to to {0} detected.", returnUrl);
    ErrorSignal.FromCurrentContext().Raise(
        new System.Security.SecurityException(message));
    return RedirectToAction("SecurityWarning", "Home");
}
```

## 使用错误日志、堆栈跟踪程序出错信息

`web.config`中有个特性

```xml
<customErrors mode="off"
```

它有三个可选项：

`On`：服务器开发的最安全选项，因为它总是隐藏错误提示消息

`RemoteOnly`：向大多数用户展示一般的错误提示消息，但是向拥有服务器访问权限的用户展示完整的错误提示信息

`Off`：最容易受到攻击的选项，它向访问网站的每个用户展示详细的错误提示消息，如果黑客恶意攻击，可能会导致代码泄露、被关闭程序等。

我们可以根据所需来判断是否使用哪种方式，例如发布后，则将之设为`On`或`Remote`，调试，则将之设为Off

```xml
<customErrors mode="Off" defaultRedirect="GenericError.htm" >
    <error statusCode="500" redirect="InternalError.htm"/>
</customErrors>
```

参考安全相关的资料

推荐：[免费资料：其中概括了十种攻击方式，英文资料](https://www.troyhunt.com/owasp-top-10-for-net-developers-part-1/)

书籍：《ASP.NET安全编程入门经典》

`AntiXSS`：http://antixss.codeplex.com/

开放式web应用程序安全项目（OWASP）http://www.owasp.org/