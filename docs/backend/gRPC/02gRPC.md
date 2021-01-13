---
title: Server Stream
date: 2021-01-06
categories:
 - 后端
tags:
 - .NET Core Grpc
author: Ruan
---

## 前言

> 接前面一元消息，实现剩下的`proto`协议：

```protobuf
rpc GetAll(GetAllRequest) returns (stream EmployeeResponse);
```

## 正文

### Server

添加`override`

```csharp
public override async Task GetAll(GetAllRequest request, IServerStreamWriter<EmployeeResponse> responseStream,
                                  ServerCallContext context)
{
    //遍历内存的数据，将其返回到前端，采用流方式
    foreach (var employee in InMemoryData.Employees)
    {
        await responseStream.WriteAsync(new EmployeeResponse
                                        {
                                            Employee = employee
                                        });
    }
}
```

### Client

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Google.Protobuf;
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
            using var channel = GrpcChannel.ForAddress("https://localhost:5001");
            var client = new EmployeeService.EmployeeServiceClient(channel);

            //由于channel只能创建一个，所以这里采用命令行方式来执行不同的传输类型
            var option = int.Parse(args[0]);
            switch (option)
            {
                //一元方式前面已经实现过了
                case 1:
                    await GetByNoAsync(client);
                    break;
                case 2:
                    await GetAllAsync(client);
                    break;
            }

            Console.WriteLine($"Press any key to exit.");
            Console.ReadKey();
        }

        private static async Task GetAllAsync(EmployeeService.EmployeeServiceClient client)
        {
            using var call = client.GetAll(new GetAllRequest());
            var responseStream = call.ResponseStream;
            while (await responseStream.MoveNext())
            {
                Console.WriteLine(responseStream.Current.Employee);
            }
        }
    }
}
```

### 运行

由于采用参数的方式，所以需要使用命令行执行

![image-20210106231142317.png](https://i.loli.net/2021/01/06/JUstjF4E6fDxl12.png)