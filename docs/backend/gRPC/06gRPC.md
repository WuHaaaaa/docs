---
title: 日志和异常 
---

## 介绍

> 这篇是关于记录日志和处理异常的，代码紧跟上篇

## 日志

1. 服务端，设置日志

![image-20210114224104590.png](https://i.loli.net/2021/01/14/CQx7VaBuTycZF5z.png)

2. 然后运行客户端，`dbug`就是`Grpc`设置的日志

![image-20210106233318527.png](https://i.loli.net/2021/01/14/7BgKsaurXmliLOR.png)

3. 设置客户端日志

   安装`Nuget`包：

   + `Serilog.Sinks.Console`

   + `Serilog.Extensions.Logging`

   `Program.cs`

   ```csharp {19-30,36,58}
   using System;
   using System.Collections.Generic;
   using System.IO;
   using System.Threading.Tasks;
   using Google.Protobuf;
   using Google.Protobuf.WellKnownTypes;
   using Grpc.Core;
   using Grpc.Net.Client;
   using GrpcServer.Web.Protos;
   using Serilog;
   using Serilog.Core;
   
   namespace GrpcServer.Web.Client
   {
       class Program
       {
           static async Task Main(string[] args)
           {
               Log.Logger = new LoggerConfiguration()
                   .MinimumLevel.Debug()
                   .WriteTo.Console()
                   .CreateLogger();
   
               Log.Information("Client starting...");
   
               using var channel = GrpcChannel.ForAddress("https://localhost:5001",
                   new GrpcChannelOptions
                   {
                       LoggerFactory = new SerilogLoggerFactory()
                   });
               // using var channel = GrpcChannel.ForAddress("https://localhost:5001");
   
               var client = new EmployeeService.EmployeeServiceClient(channel);
   
               // var option = int.Parse(args[0]);
               var option = 5;
               switch (option)
               {
                   case 1:
                       await GetByNoAsync(client);
                       break;
                   case 2:
                       await GetAllAsync(client);
                       break;
                   case 3:
                       await AddPhotoAsync(client);
                       break;
                   case 5:
                       await SaveAllAsync(client);
                       break;
                   default:
                       break;
               }
   
               Console.WriteLine($"Press any key to exit.");
               Console.ReadKey();
   
               Log.CloseAndFlush();
           }
   
           
       }
   }
   ```

4. 添加一个`SerialogLoggerFactory.cs`

   ```csharp
   using Microsoft.Extensions.Logging;
   using Serilog.Debugging;
   using Serilog.Extensions.Logging;
   
   namespace GrpcServer.Web.Client
   {
       public class SerilogLoggerFactory : ILoggerFactory
       {
           private readonly SerilogLoggerProvider _provider;
   
           public SerilogLoggerFactory(Serilog.ILogger logger = null, bool dispose = false)
           {
               _provider = new SerilogLoggerProvider(logger, dispose);
           }
   
           public void Dispose()
           {
               _provider.Dispose();
               throw new System.NotImplementedException();
           }
   
           public ILogger CreateLogger(string categoryName)
           {
               return _provider.CreateLogger(categoryName);
               // throw new System.NotImplementedException();
           }
   
           public void AddProvider(ILoggerProvider provider)
           {
               SelfLog.WriteLine("Ignoring added logger provider {0}", provider);
               // throw new System.NotImplementedException();
           }
       }
   }
   ```

### 运行

运行，客户端日志

![image-20210114223814033](https://i.loli.net/2021/01/14/8hTeOAFDrdjtnVg.png)

## 异常处理

服务端出现异常捕获

假设`GetByNo`出现异常，我们可以如何处理：

```csharp
...
public override Task<EmployeeResponse>
    GetByNo(GetByNoRequest request, ServerCallContext context)
{
    try
    {
        var md = context.RequestHeaders;
        foreach (var pair in md)
        {
            _logger.LogInformation($"{pair.Key}:{pair.Value}");
        }

        var employee = InMemoryData.Employees.SingleOrDefault(x => x.No == request.No);
        if (employee != null)
        {
            var response = new EmployeeResponse()
            {
                Employee = employee
            };
            return Task.FromResult(response);
        }

        //假设服务端抛出异常
        if (true)
        {
            //抛出一个RPC异常
            throw new RpcException(Status.DefaultCancelled, "Server error...");
        }
    }
    catch (RpcException re)
    {
        throw;
    }
    catch (Exception e)
    {
        _logger.LogError(e.Message);
        //抛出异常
        throw new RpcException(Status.DefaultCancelled, e.Message);
    }
}
```

服务端出现异常，客户端则需要捕获异常：

客户端代码：

```csharp
static async Task Main(string[] args)
{
    Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Debug()
        .WriteTo.Console()
        .CreateLogger();

    Log.Information("Client starting...");

    using var channel = GrpcChannel.ForAddress("https://localhost:5001",
                                               new GrpcChannelOptions
                                               {
                                                   LoggerFactory = new SerilogLoggerFactory()
                                               });

    var client = new EmployeeService.EmployeeServiceClient(channel);
    var option = 1; //默认用第一个（也就是服务端有异常的那个）
    switch (option)
    {
        case 1:
            await GetByNoAsync(client);
            break;
            ...
    }
    Console.WriteLine($"Press any key to exit.");
    Console.ReadKey();
    // Log.CloseAndFlush();
}

public static async Task GetByNoAsync(EmployeeService.EmployeeServiceClient client)
{
    var md = new Metadata
    {
        {"username", "dave"},
        {"role", "administrator"}
    };

    try
    {
        var result = await client.GetByNoAsync(
            new GetByNoRequest
            {
                No = 1994
            }, md);
        Console.WriteLine($"Response message: {result}");
    }
    //捕获grpc异常
    catch (RpcException re)
    {
        Log.Logger.Error(re.Message);
    }
}
```

### 运行

![image-20210117132816397](https://i.loli.net/2021/01/17/DrZYUcxVbWaGpof.png)

可能传统的异常信息无法完善错误信息，我们也可以传递元数据，让错误信息更完善

```csharp {9-15}
public override Task<EmployeeResponse>
    GetByNo(GetByNoRequest request, ServerCallContext context)
{
    try
    {
        //假设服务端抛出异常
        if (true)
        {
            var trailer = new Metadata
            {
                {"field", "No"}, //假设No字段出现了问题
                {"Message", "Something went wrong..."}
            };
            //抛出一个RPC异常
            throw new RpcException(new Status(StatusCode.DataLoss,"Data is lost..."), trailer);
        }

        var md = context.RequestHeaders;
        foreach (var pair in md)
        {
            _logger.LogInformation($"{pair.Key}:{pair.Value}");
        }

        var employee = InMemoryData.Employees.SingleOrDefault(x => x.No == request.No);
        if (employee != null)
        {
            var response = new EmployeeResponse()
            {
                Employee = employee
            };
            return Task.FromResult(response);
        }
    }
    catch (RpcException re)
    {
        throw;
    }
    catch (Exception e)
    {
        _logger.LogError(e.Message);
        throw new RpcException(Status.DefaultCancelled, e.Message);
    }
}
```

客户端代码

```csharp {21-25}
public static async Task GetByNoAsync(EmployeeService.EmployeeServiceClient client)
{
    var md = new Metadata
    {
        {"username", "dave"},
        {"role", "administrator"}
    };

    try
    {
        var result = await client.GetByNoAsync(
            new GetByNoRequest
            {
                No = 1994
            }, md);
        Console.WriteLine($"Response message: {result}");
    }

    catch (RpcException re)
    {
        //如果错误信息是DataLoss，就把错误详细信息抛出
        if (re.StatusCode == StatusCode.DataLoss)
        {
            Log.Logger.Error($"{re.Trailers}");
        }
        Log.Logger.Error(re.Message);
    }
}
```

运行

![image-20210117133908290](https://i.loli.net/2021/01/17/ufDKESAPV8OFrab.png)

我们调试，可以看到更具体的`DataLoss`信息

![image-20210117134230442](https://i.loli.net/2021/01/17/h1mYyeos5Rxjdwg.png)