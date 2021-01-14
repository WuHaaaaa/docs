---
title: 日志和异常 
---

## 介绍

> 这篇是关于记录日志和处理异常的，代码紧跟上篇

## 日志

1. 服务端，设置日志

![image-20210114224104590.png](https://i.loli.net/2021/01/14/CQx7VaBuTycZF5z.png)

2. 然后运行客户端，`dbug`就是 Grpc 设置的日志

![image-20210106233318527.png](https://i.loli.net/2021/01/14/7BgKsaurXmliLOR.png)

3. 设置客户端日志

   安装 Nuget 包：

   + Serilog.Sinks.Console

   + Serilog.Extensions.Logging

   Program.cs

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

5. 运行，客户端日志

![image-20210114223814033](https://i.loli.net/2021/01/14/8hTeOAFDrdjtnVg.png)

## 异常处理