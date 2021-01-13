---
title: .NET MVC 自定义RemoteAttribute提交验证
date: 2020-10-24
categories:
 - 后端
tags:
 - C#
 - .NET MVC
author: Ruan
---
## 前言

> 最近遇到的问题还是蛮多的，可能这也是加深自己.NET MVC 最好的时候吧。
>
> 在项目中，因为使用Ajax的提交方式，导致点击提交，表单走的是Ajax方式，绕过了表单提示（例如：表单中`用户名`提示重复，但是还是提交成功，新增一条记录），在调试的时候发现，虽然Remote属性触发了后台验证，也返回到前端，并显示出来，但是还是走到了`ModelState.IsValid`，并且通过了验证。

<!-- more -->

## 正文

### 问题截图

![](https://i.imgur.com/uj6IgDr.gif)

+ 图片中Create，是属于页面内部的Submit，错误出现后，它不会触发提交，但是也拿不到返回值

+ 可以看出，Remote特性，是离开焦点，即会触发验证
+ 保存按钮，在前端提示了错误信息后，仍然保存成功，因为`ModelState`的错误信息未包含进来，导致验证判断通过（`ModelState.IsValid = true`）

### 问题分析

在表单提交时，使用Ajax提交，非表单自身submit提交，而是在外部嵌套了一个弹窗（Bootstrap3-dialog），因为我像使用Ajax提交后，拿到返回值，进一步提示用户操作。

但是这里发现一个问题，虽然我的某个字段进行了特性验证，但是并没有阻止Ajax提交（这是肯定的，Ajax执行前并没有加判断条件，例如：表单未通过验证之类的，就不执行Ajax）。所以，当表单提示了重复后，代码还是继续向后执行，到了保存这一步，并且，`ModelState.IsValid`的值为`True`（不对啊，界面都显示了错误，但是`ModelState`里面没有，我认为这里是因为`RemoteAttribute`特性的原因）

### 问题尝试

在上网搜索问题时、前，我认为可以尝试几种方式：

1. `Ajax`里面，触发`submit`提交，触发表单错误，而且表单也会实时返回错误，阻止`submit`提交到后端。感觉这很不错，但是这样，我拿不到后端执行后的结果（我不知道如何使用`submit`提交后，拿到后端执行返回结果）。这个有点不完美（我提示不了用户了，比如：操作成功之类的）
2. 前端在Ajax请求时，在拿到的数据里面判断（我可以通过`bootstrap3-dialog`弹窗，拿到表单中任何信息），若表单中有错误信息，那么我就不提交表单。这个解决方式，（我认为是可行的，提取一下表单的错误信息即可）
3. 后端`RemoteAttribute`重写，将其错误信息放在`ModelState`中（为什么其他Required，Range之类的`错误信息`都可以放在`ModelState`，你`RemoteAttribute`不行），所以我打算采用这种方式，表示我的不服🙃

### 问题解决

首先，尝试了一下我前端时间刚学到的**`自定义验证逻辑`**，这是个好东西，我们可以任意定义验证逻辑，在所有`Model`中应用，或只在单一的`Model`中应用，各有所长。这里我选择重复使用率高的（在所有`Model`中应用），[参考：ASP.NET MVC5 高级编程笔记（三）](http://ruanheng.xyz/2019/11/20/ASP-NET-MVC5-%E9%AB%98%E7%BA%A7%E7%BC%96%E7%A8%8B%EF%BC%88%E4%B8%89%EF%BC%89/)

然后我在`Stackoverflow`看到了这个问题及回答

问：`ASP.MVC3 ModelState.IsValid not include RemoteAttribute checking`（`ModelState`中不包含`RemoteAttribute`特性的验证）

回答建议：重写一个`RemoteAttribute`，或实现`IDataErrorInfo`或`IValidatableObject`，然后在此重做验证（不是很懂，可能还没有学到这里）

### 代码

目录结构

controller，里面包含控制器，及验证重复的具体逻辑，查询，返回结果等

model，包含模型，及自定义验证逻辑（`DataIsExistsAttribute`）

Resources，包含资源文件，例如多语言支持

![](https://i.imgur.com/VLMdvES.png)

controller

```CSharp
/// <summary>
/// 验证某地区是否已存在相同的楼层
/// </summary>
/// <returns></returns>
[HttpGet]
public ActionResult CheckFloorNoIsExists(FloorModel model)
{
    var result = server.SelectFloorToFloor(model.floorcode, model.floor) == 0;
    return Json(result, JsonRequestBehavior.AllowGet);
}
```

弹出页`view`

```javascript
//弹出页，需对jQuery，以及jQueryValidate引用
@Scripts.Render("~/bundles/jquery")
//就是Jquery
//<script src="/Scripts/jquery-2.1.4.js"></script>

@Scripts.Render("~/bundles/jqueryval")
//就是下面这两个
//<script src="~/Scripts/jquery.validate.min.js"></script>
//<script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
```

弹出页，父页view，插件可以**参考地址**

```javascript
function Add() {
    top.Dialog.Form({
        title: "@Resource.Import - @Resource.btnAdd",
        url: "/FloorConfig/Add",
        btnSave:"@Resource.btnSave",
        btnCancel:"@Resource.btnCancel",
        dialogInfo: "@Resource.dialogInfo",
    }, reload);
}
```

`/App_Start/BundleConfig.cs`

```CSharp
public class BundleConfig
{
    public static void RegisterBundles(BundleCollection bundles)
    {
        bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            "~/Scripts/jquery-{version}.js"));

        bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            "~/Scripts/jquery.validate*"));
    }
}
```

model

```CSharp
public class FloorModel
{
    /// <summary>
    /// 楼层编号
    /// </summary>
    //特性校验，自定义特性，传入两个参数，多语言方式
    [DataIsExists("CheckFloorNoIsExists", "FloorConfig", ErrorMessageResourceType = typeof(Resources.Resource), ErrorMessageResourceName = "msgFoolr", AdditionalFields = "floorcode,floor")]
    //之前的方式
    //[Remote("CheckFloorNoIsExists", "FloorConfig", ErrorMessageResourceType = typeof(Resources.Resource), ErrorMessageResourceName = "msgFoolr", AdditionalFields = "floorcode,floor")]
    public int floor { get; set; }

    /// <summary>
    /// 地区编号
    /// </summary>
    [Required(ErrorMessageResourceType = typeof(Resources.Resource), ErrorMessageResourceName = "notNull")]
    [Display(ResourceType = typeof(Resources.Resource), Name = "areaNumber")]
    public string floorcode { get; set; }

    //..
}
```

`DataIsExistsAttribute.cs`

```CSharp
public class DataIsExistsAttribute : RemoteAttribute
{
    //重写应有的方法，到时候其他模型调用更方便
    public DataIsExistsAttribute(string routeName): base(routeName)
    {

    }

    public DataIsExistsAttribute(string action, string controller) : base(action,controller)
    {

    }

    public DataIsExistsAttribute(string action, string conrtoller, string areaName) : base(action, conrtoller, areaName)
    {

    }
    
	//重写IsValid方法
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        
        //获取传入controller,由于主项目已经引用Model类库，若Model再引用主项目将导致嵌套引用，所以采用反射的方式
        Type controller = Assembly.Load("xxxx.xxx.webPlatform").GetTypes().
            FirstOrDefault(type => type.Name.ToLower() == string.Format("{0}Controller", this.RouteData["controller"].ToString()).ToLower());

        if (controller != null)
        {
            //获取Action
            MethodInfo action = controller.GetMethods().
                FirstOrDefault(method => method.Name.ToLower() == this.RouteData["action"].ToString().ToLower());
            if (action != null)
            {
                //创建控制器实例，并调用方法，传入ObjectInstance这个参数，即FloorModel整个对象
                object instance = Activator.CreateInstance(controller);
                object response = action.Invoke(instance, new object[] { validationContext.ObjectInstance });
                //判断返回是否是JsonResult类型
                if (response is JsonResult)
                {
                    //拿到Data
                    object jsonData = ((JsonResult)response).Data;
                    //根据Data判断是否返回验证成功，若未成功，则会添加进ModelState中
                    if (jsonData is bool)
                    {
                        return (bool)jsonData ? ValidationResult.Success :
                        new ValidationResult(this.ErrorMessage);
                    }
                }
            }
        }
        return base.IsValid(value, validationContext);
    }
}
```

最终效果（前面已有的数据，后面再新增，通过Ajax的方式也不会再进行提交了）

![](https://i.imgur.com/Z65gnUd.gif)

## 感谢

在遇到问题时，我在`Stackoverflow`中遇到了解决方案（`RemoteAttribute`重写思路），[地址在这](https://stackoverflow.com/questions/9077469/asp-mvc3-modelstate-isvalid-not-include-remoteattribute-checking)

重写的时候，看到一位大佬写的例子：[C# Corner : Create a Custom Remote Attribute in MVC]( https://www.c-sharpcorner.com/UploadFile/ee01e6/create-a-custom-remote-attribute-in-mvc/ )，只想说，示例太详细了，照着写一遍，可以一模一样的跑起来

