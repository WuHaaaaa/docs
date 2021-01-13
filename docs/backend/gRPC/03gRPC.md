---
title: Client Stream
date: 2021-01-06
categories:
 - 后端
tags:
 - .NET Core Grpc
author: Ruan
---



## 前言

> 继续完成
>
> ```protobuf
> rpc AddPhoto(stream AddPhotoRequest) returns (AddPhotoResponse);
> ```

## 正文

由于是客户端流，可以先实现客户端功能，这里实现的是一个图片上传的功能，上传到后端，后端存入图片，返回前端结果

### Client

目录结构

![image-20210106232109327.png](https://i.loli.net/2021/01/06/ZcPz53syXCN9vxA.png)

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

            var option = int.Parse(args[0]);
            switch (option)
            {
                case 1:
                    await GetByNoAsync(client);
                    break;
                case 2:
                    await GetAllAsync(client);
                    break;
                case 3:
                    //上传照片
                    await AddPhotoAsync(client);
                    break;
                default:
                    break;
            }

            Console.WriteLine($"Press any key to exit.");
            Console.ReadKey();
        }
        
        public static async Task AddPhotoAsync(EmployeeService.EmployeeServiceClient client)
        {
            //这里也可以传输元数据
            var md = new Metadata
            {
                {"username", "dave"},
                {"role", "administrator"}
            };

            //首先读取数据
            FileStream fs = File.OpenRead("logo.png");
            var call = client.AddPhoto(md);
            //创建请求数据流
            var stream = call.RequestStream;

            while (true)
            {
                byte[] buffer = new byte[1024];
                //读取数据长度
                int numRead = await fs.ReadAsync(buffer, 0, buffer.Length);
                //判断是否已经读取完
                if (numRead == 0)
                {
                    break;
                }

                //若读取到长度小于buffer，则将buffer重置为numRead大小
                if (numRead < buffer.Length)
                {
                    Array.Resize(ref buffer, numRead);
                }

                //将图片读写到流中
                await stream.WriteAsync(new AddPhotoRequest {Data = ByteString.CopyFrom(buffer)});
            }

            //告知服务器上传完成
            await stream.CompleteAsync();
            //接收服务器返回的消息
            var res = await call.ResponseAsync;
            Console.WriteLine(res);
        }
    }
}
```

### Server

```csharp
public override async Task<AddPhotoResponse> AddPhoto(IAsyncStreamReader<AddPhotoRequest> requestStream,
            ServerCallContext context)
        {
            var md = context.RequestHeaders;
            foreach (var pair in md)
            {
                Console.WriteLine($"{pair.Key}:{pair.Value}");
            }

            var data = new List<byte>();
            //取出请求数据
            while (await requestStream.MoveNext())
            {
                Console.WriteLine($"Receive: {requestStream.Current.Data.Length} bytes");
                data.AddRange(requestStream.Current.Data);
            }

            //打印，返回结果
            Console.WriteLine($"Received file with {data.Count} bytes ");

            //在这里，还可以存储图片到本地
            FileStream fs = File.OpenWrite("logo.png");
            await fs.WriteAsync(data.ToArray(), 0, data.ToArray().Length);
            await fs.DisposeAsync();
            fs.Close();

            return new AddPhotoResponse
            {
                IsOk = true
            };
        }
```

### 运行

![image-20210106232453759.png](https://i.loli.net/2021/01/06/jt1gdaLGImCOP5W.png)

Server端多出一张图片

![image-20210106232635860.png](https://i.loli.net/2021/01/06/ArdOJ1ocNIKs6vb.png)