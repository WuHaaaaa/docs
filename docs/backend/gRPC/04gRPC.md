---
title: Client&Server Stream
date: 2021-01-06
categories:
 - 后端
tags:
 - .NET Core Grpc 
author: Ruan
---

## 前言

> 继续完成未完成协议
>
> ```protobuf
> rpc SaveAll(stream EmployeeRequest) returns (stream EmployeeResponse);
> ```

## 正文

### Client

```csharp
private static async Task SaveAllAsync(EmployeeService.EmployeeServiceClient client)
{
    var employees = new List<Employee>
    {
        new Employee
        {
            Id = 111,
            FirstName = "Monica",
            LastName = "Geller",
            Salary = 7890.1f,
        },
        new Employee
        {
            No = 222,
            FirstName = "Joey",
            LastName = "Tribbiani",
            Salary = 500
        }
    };


    var call = client.SaveAll();

    //因为两端都是用流的方式传输，所以需要获取两个流示例
    var requestStream = call.RequestStream;
    var responseStream = call.ResponseStream;

    //创建一个响应流Task,用于接收服务器端返回的消息
    var responseTask = Task.Run(async () =>
                                {
                                    while (await responseStream.MoveNext())
                                    {
                                        Console.WriteLine($"Saved:{responseStream.Current.Employee}");
                                    }
                                });

    //像之前一样，向请求流中写入数据
    foreach (var employee in employees)
    {
        await requestStream.WriteAsync(new EmployeeRequest
                                       {
                                           Employee = employee
                                       });
    }

    //顺序不可调换，否则会一直收不到服务器端返回的消息
    await requestStream.CompleteAsync();
    await responseTask;
}
```

### Server

```csharp
public override async Task SaveAll(IAsyncStreamReader<EmployeeRequest> requestStream,
                                   IServerStreamWriter<EmployeeResponse> responseStream, ServerCallContext context)
{
    while (await requestStream.MoveNext())
    {
        var employee = requestStream.Current.Employee;
        lock (this)
        {
            InMemoryData.Employees.Add(employee);
        }
        await responseStream.WriteAsync(new EmployeeResponse
                                        {
                                            Employee = employee
                                        });
    }

    Console.WriteLine("Employees:");
    foreach (var employee in InMemoryData.Employees)
    {
        Console.WriteLine(employee);
    }
}
```

### 运行

![image-20210106233318527.png](https://i.loli.net/2021/01/06/L6UGjbr7Il2kPJq.png)