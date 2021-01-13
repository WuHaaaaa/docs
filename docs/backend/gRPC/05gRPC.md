---
title: 需求变更过程
date: 2021-01-08
categories:
 - 后端
tags:
 - .NET Core Grpc 
author: Ruan
---



## 前言

在开发的时候，可能会遇到需求变更，比如添加一些字段，删除一些字段，这些变更，会导致Grpc文件发生改变，相应的客户端，服务端也会改变

## 正文

### 修改服务端proto字段，客户端不变

我们对员工的薪资进行修改，因为Salary不能表示多种类型的工资，所以打算用多个字段来表示，比如基础工资，绩效奖金等

首先，修改proto文件，看看当服务器端proto文件修改了，客户端，会有啥问题

服务器端`Message.proto`（需要修改服务端因Salary被废弃而报错的Employee）

```protobuf {10-12}
syntax = "proto3";

option csharp_namespace = "GrpcServer.Web.Protos";

message Employee {
  int32 id = 1;
  int32 no = 2;
  string firstName = 3;
  string lastName = 4;
  // float salary = 5;
  reserved 5;
  reserved "salary";
}

message GetByNoRequest { int32 no = 1; }
message EmployeeResponse { Employee employee = 1; }

message GetAllRequest {}

message AddPhotoRequest { bytes data = 1; }

message AddPhotoResponse { bool isOk = 1; }

message EmployeeRequest { Employee employee = 1; }

service EmployeeService {
  rpc GetByNo(GetByNoRequest) returns (EmployeeResponse);
  rpc GetAll(GetAllRequest) returns (stream EmployeeResponse);
  rpc AddPhoto(stream AddPhotoRequest) returns (AddPhotoResponse);
  rpc Save(EmployeeRequest) returns (EmployeeResponse);
  rpc SaveAll(stream EmployeeRequest) returns (stream EmployeeResponse);
}
```

然后我们运行客户端，可以看到，Salary已经没有了

![image-20210110215343032](https://i.loli.net/2021/01/10/hxsUBHVz9J1ba2D.png)

但是没有报错，因为字段只有服务端改变了，而客户端proto文件没有变更

### 服务端客户端使用同一个文件

因为我们在本地开发，所以可以只是用同一个文件，不然服务端字段修改了，客户端也要复制粘贴一遍

1. 把客户端proto文件删除

![image-20210110215958590](https://i.loli.net/2021/01/10/fOdryo9T1a7hpKn.png)

2. 选择项目，右键，添加>服务引用

![image-20210110220210129](https://i.loli.net/2021/01/10/dsvJxcufj5I3nAN.png)

3. 点击服务引用的添加，选择gRPC并选择路径，因为我们的文件是在本地，所以选择文件路径，我们也可以选择URL，因为这是客户端使用，生成当然选择`客户端`

![image-20210110220248952](https://i.loli.net/2021/01/10/T4CBiPtNdKlgLmG.png)

![image-20210110220430751](https://i.loli.net/2021/01/10/OGUgHYtjhlFTmCA.png)

4. 等待一会儿，还要安装一个引用

![image-20210110220603145](https://i.loli.net/2021/01/10/nvwRSCz34lxjDXs.png)

5. 然后，我们可以看到，当前解决方案中，响应的文件已经在目录中了

![image-20210110220711983](https://i.loli.net/2021/01/10/5mtcXNnH68qZjya.png)

6. 我们可以看一下他的属性

![image-20210110220900986](https://i.loli.net/2021/01/10/b14rQBtuCqxJVeH.png)

之后，我们重新生成一下，解决一下客户端的`Salary`字段报错问题，这个问题就处理完了

### 服务端添加新的需求

我们将`Salary`设置为保留字段，然后想添加一个表示更全面的薪资字段，这个字段需要自定义

首先新增一个类型`MonthSalary`表示月薪，其中包含两个字段

我们还添加了一个枚举，表示员工状态，这时，我们可以采用外部引用的方式

`Message.proto`

```protobuf {5,6,18,20,21,24-27}
syntax = "proto3";

option csharp_namespace = "GrpcServer.Web.Protos";

//需要在头部添加引用
import "Protos/Enums.proto";

message Employee {
  int32 id = 1;
  int32 no = 2;
  string firstName = 3;
  string lastName = 4;
  // float salary = 5;

  reserved 5;
  reserved "salary";

  MonthSalary monthSalary = 6;	//由于之前字段已经被保留，我们接下来的tag不能重复，就继续增加

  //引用外部的枚举类型
  EmployeeStatus status = 7;
}

message MonthSalary{
	float basic = 1;	//基础薪资
	float bonus = 2;	//奖金
}
...
```

`Enums.protos`

```protobuf
syntax = "proto3";

option csharp_namespace = "GrpcServer.Web.Protos";

//雇员状态枚举
enum EmployeeStatus {
 NORMAL = 0;
 ONVACATION = 1;
 RESIGNED = 2;
 RETAIRED = 3;
}
```

文件结构

![image-20210110222144277](https://i.loli.net/2021/01/10/M7cd23AVyNZIB6h.png)

然后重新生成会报错，因为我们没有选择`Enums.proto`的生成类型

![image-20210110222326795](https://i.loli.net/2021/01/10/2YZ6OfHICp3UodG.png)

生成我们要选择`不生成`：表示编译的时候，我们不生成服务端、客户端代码，只生成消息类型即可

![image-20210110222413911](https://i.loli.net/2021/01/10/R95YsxPhmfjCBEO.png)

添加新的数据类型，从Google，或其他地方，比如添加一个时间戳类型

```protobuf {7,25}
syntax = "proto3";

option csharp_namespace = "GrpcServer.Web.Protos";

//需要在头部添加引用
import "Protos/Enums.proto";
//引用官网的时间戳类型
import "google/protobuf/timestamp.proto";

message Employee {
  int32 id = 1;
  int32 no = 2;
  string firstName = 3;
  string lastName = 4;
  // float salary = 5;


  reserved 5;
  reserved "salary";

  MonthSalary monthSalary = 6;	//由于之前字段已经被预留，我们接下来的tag不能重复，就继续增加

  //引用外部的枚举类型
  EmployeeStatus status = 7;
  //需要写完整个命名空间，否则会报错
  google.protobuf.Timestamp lastModified = 8;
}
...
```

客户端也需要添加额外的文件引用，因为服务端添加了一个`Enums.proto`

与之前添加引用一样（不同的是，这里选择只限消息（Message Only））

![image-20210110223243522](https://i.loli.net/2021/01/10/BH7jVZ8SC4Q6qKd.png)

接下来重新生成，报错了

因为客户端文件路径有问题（客户端 proto 文件认为 Protos 文件夹是根目录，而服务端认为 GrpcServer.Web 才是根目录，它们相差了一层文件夹，所以需要指定一下文件夹路径）

解决：在服务器端，也把 proto 文件路径改写成 Protos

单击项目，然后添加 ProtoRoot 属性，设置目录为Protos文件夹

![image-20210110223953433](https://i.loli.net/2021/01/13/8jEoSYDtxH4VFGh.png)

这里改了后，需要把 Protos/Message.proto 也修改一下

```protobuf {6}
syntax = "proto3";

option csharp_namespace = "GrpcServer.Web.Protos";

//需要在头部添加引用
import "Enums.proto";	//去掉 Proots/
import "google/protobuf/timestamp.proto";

message Employee {
...
```

接着重新生成服务端、客户端，OK~

添加了新的类型，我们可以顺便添加一些新的数据，验证一下，我们的程序是否可以正常运行

```csharp {20-26}
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices.ComTypes;
using Google.Protobuf.WellKnownTypes;
using GrpcServer.Web.Protos;

namespace GrpcServer.Web.Data
{
    public class InMemoryData
    {
        public static List<Employee> Employees = new List<Employee>()
        {
            new Employee()
            {
                Id = 1,
                No = 1994,
                FirstName = "Chandler",
                LastName = "Bing",
                // Salary = 2200,
                MonthSalary = new MonthSalary
                {
                    Basic = 5000f,
                    Bonus = 1250.5f,
                },
                Status = EmployeeStatus.Normal,
                LastModified = Timestamp.FromDateTime(DateTime.UtcNow)  //谷歌的这个TimeStamp一定要使用UtcNow,否则程序会报错
            },
            ...
        };
    }
}
```

然后，我们就可以跑程序看看了，成功！：）

![image-20210110224755463](https://i.loli.net/2021/01/10/fbXjwS1B96agAE8.png)

