---
title: 一元消息
date: 2021-01-05
categories:
 - 后端
tags:
 - .NET Core Grpc
author: Ruan
---

## 前言

继续学习`gRPC`，[学习地址](https://www.bilibili.com/video/BV1eE411T7GC?p=7)，落地一个示例项目，[项目地址]()

## 正文

> 实现结构：
>
> gRPC Server：ASP.NET Core
>
> gRPC Client：.NET Core (Console)

server安装NuGet库：

+ Grpc.AspNetCore

client安装NuGet库：

+ Grpc.Net.Client
+ Google.Protobuf
+ Grpc.Tools

### 步骤

### ServerDemo

+ 首先创建`GrpcServer`，创建一个空的AspNetCore应用

+ 添加Protos文件夹

+ 创建Message.proto文件

  ```protobuf
  syntax = "proto3";	//自动生成（默认协议2，指定使用协议3）
  
  option csharp_namespace = "GrpcServer.Web.Protos";	//自动生成（生成后的命名空间）
  
  //定义一系列message
  message Employee {
    int32 id = 1;
    int32 no = 2;
    string firstName = 3;
    string lastName = 4;
    float salary = 5;
  }
  
  message GetByNoRequest { int32 no = 1; }
  message EmployeeResponse { Employee employee = 1; }
  
  message GetAllRequest {}
  
  message AddPhotoRequest { bytes data = 1; }
  
  message AddPhotoResponse { bool isOk = 1; }
  
  message EmployeeRequest { Employee employee = 1; }
  
  //定义服务
  service EmployeeService {
    //定义具体的方法
    rpc GetByNo(GetByNoRequest) returns (EmployeeResponse);
    rpc GetAll(GetAllRequest) returns (stream EmployeeResponse);
    rpc AddPhoto(stream AddPhotoRequest) returns (AddPhotoResponse);
    rpc Save(EmployeeRequest) returns (EmployeeResponse);
    rpc SaveAll(stream EmployeeRequest) returns (stream EmployeeResponse);
  }
  ```

+ 安装Server端需要的NuGet包

+ 右键Message.proto，属性，生成操作，出现编译选项，选择`Protobuf compiler`，gRPC选择Server Only

  ![image-20210105113259541](https://i.loli.net/2021/01/05/VTc6qmEhiLQI4gs.png)

  

  ![image-20210105113319753](https://i.loli.net/2021/01/05/2nr3WsBaAJGk7Yo.png)

+ 创建Services文件夹，创建MyEmployeeService.cs

  ```csharp
  using System;
  using System.Linq;
  using System.Threading.Tasks;
  using Grpc.Core;
  using GrpcServer.Web.Data;
  using GrpcServer.Web.Protos;
  using Microsoft.Extensions.Logging;
  
  namespace GrpcServer.Web.Services
  {
      public class MyEmployeeService : EmployeeService.EmployeeServiceBase
      {
          //logger可以在跑程序的时候，输出日志到控制台界面
          private readonly ILogger<MyEmployeeService> _logger;
          public MyEmployeeService(ILogger<MyEmployeeService> logger)
          {
              _logger = logger;
          }
  
          //重写刚才定义的一个方法
          public override Task<EmployeeResponse>
              GetByNo(GetByNoRequest request, ServerCallContext context)
          {
              //客户端可以定义一些元数据发到服务端
              var md = context.RequestHeaders;
              foreach (var pair in md)
              {
                  //控制台输出键值对
                  _logger.LogInformation($"{pair.Key}:{pair.Value}");
              }
  
              //首先根据请求的no获取数据
              var employee = InMemoryData.Employees.SingleOrDefault(x => x.No == request.No);
              if (employee != null)
              {
                  //存在数据，则返回到客户端
                  var response = new EmployeeResponse()
                  {
                      Employee = employee
                  };
                  return Task.FromResult(response);
              }
              //否则抛出异常
              throw new Exception($"Employee not found with no: {request.No}");
          }
      }
  }
  ```

+ 模拟数据库数据，InmemoryData.cs

  ```csharp
  using System.Collections.Generic;
  using System.Runtime.InteropServices.ComTypes;
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
                  Salary = 2200,
              },
              new Employee()
              {
                  Id = 2,
                  No = 1999,
                  FirstName = "Rachel",
                  LastName = "Green",
                  Salary = 2400,
              },
              new Employee()
              {
                  Id = 2,
                  No = 2004,
                  FirstName = "Rose",
                  LastName = "Geller",
                  Salary = 3405.5f,
              },
          };
      }
  }
  ```

+ 修改`Properties/launchSettings.json`

  ```json
  {
    "profiles": {
      "GrpcServer.Web": {
        "commandName": "Project",
        "dotnetRunMessages": "true",
        "launchBrowser": false,
        "applicationUrl": "https://localhost:5001",//把http删除，grpc默认使用https传输
        "environmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Development"
        }
      }
    }
  }
  
  ```

+ 在Startup.cs添加grpc相关代码

  ```csharp {20,33,37}
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.AspNetCore.Http;
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.Hosting;
  using System;
  using System.Collections.Generic;
  using System.Linq;
  using System.Threading.Tasks;
  using GrpcServer.Web.Services;
  
  namespace GrpcServer.Web
  {
      public class Startup
      {
          // This method gets called by the runtime. Use this method to add services to the container.
          // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
          public void ConfigureServices(IServiceCollection services)
          {
              services.AddGrpc();	//添加grpc
          }
  
          // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
          public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
          {
              if (env.IsDevelopment())
              {
                  app.UseDeveloperExceptionPage();
              }
  
              app.UseRouting();
  
              app.UseHttpsRedirection();  //启动安全链接
  
              app.UseEndpoints(endpoints =>
              {
                  endpoints.MapGrpcService<MyEmployeeService>(); //注册一下刚才生成的服务
              });
          }
      }
  }
  
  ```

### ClientDemo

+ 创建一个控制台程序（.net core）

+ 安装刚才列出的nuget包

+ 创建`protos`文件夹，将刚才定义的proto文件拷贝过来

+ 按之前截图一样，设置compiler，gRPC选择client only

+ 然后Program.cs

  ```csharp
  using System;
  using System.Threading.Tasks;
  using Google.Protobuf.WellKnownTypes;
  using Grpc.Core;
  using Grpc.Net.Client;
  using GrpcServer.Web.Protos;
  
  namespace GrpcServer.Web.Client
  {
      class Program
      {
          static async Task Main(string[] args)
          {
              //可以定义元数据
              var md = new Metadata
              {
                  {"username", "dave"},
                  {"role", "administrator"}
              };
              //定义一个通道，地址是刚才server的地址
              //using 是c#8.0 语法，类似之前的using(){}
              //用完即销毁
              using var channel = GrpcChannel.ForAddress("https://localhost:5001");
              //创建一个client
              var client = new EmployeeService.EmployeeServiceClient(channel);
              //client调用异步方法
              var result = await client.GetByNoAsync(
                  new GetByNoRequest()
                  {
                      No = 1994
                  },md) ;	//可以传入元数据，也可以不传递
              Console.WriteLine($"Response message: {result}");
              Console.WriteLine($"Press any key to exit.");
              Console.ReadKey();
          }
      }
  }
  ```

### 运行

Server

![image-20210105144744706](https://i.loli.net/2021/01/05/jnYNAeiBu1kQxOS.png)

Client

![image-20210105144815757](https://i.loli.net/2021/01/05/AiXdI389roMfySD.png)