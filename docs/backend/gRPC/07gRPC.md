---
title: JWT验证和授权
---

## 前言

在开发的时候，通常，需要添加认证，`grpc`也是如此，否则将会造成数据泄露等危险，下图是一个简单的说明：

Data Center：类似公司内部的服务器，相关服务器之间采用`grpc`通信，然后某个服务器，对外暴露。这样，外面的服务器可以通过认证，访问公司内部数据

这里的**对外暴露服务器**就可以采用`JWT`认证（也可以采用其他的认证方法），

下面示例是采用的`JWT`，后续还会有一个关于客户端证书的示例

[图片来源：B站，杨旭大佬的gRPC视频](https://www.bilibili.com/video/BV1eE411T7GC?p=11)

<img src="https://i.loli.net/2021/01/17/gmU1pi5xut2nEAN.png" alt="image-20210117221137827" style="zoom: 50%;" />

## 步骤

注：代码是一系列的文章中接着写的，视频可参考[B站大佬杨旭的视频](https://www.bilibili.com/video/BV1eE411T7GC?p=11)

### 首先

把整个JWT认证的框架先搭建起来

+ 安装`NuGet`包：`Microsoft.AspNetCore.Authentication.JwtBearer`

+ 然后是`Server`端：

  `Startup.cs`添加一些服务

  ```csharp {8-10,26-27}
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddScoped<JwtTokenValidationService>();
  
      services.AddGrpc();
  	
      //GRPC权限验证
      services.AddAuthorization();
      services.AddAuthentication()
          .AddJwtBearer();	//这个就是上门安装的那个包
  }
  
  // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
      if (env.IsDevelopment())
      {
          app.UseDeveloperExceptionPage();
      }
  
      app.UseRouting();
  
      app.UseHttpsRedirection(); //启动安全链接
  
      //GRPC权限验证
      app.UseAuthentication(); //认证
      app.UseAuthorization(); //授权
  
      app.UseEndpoints(endpoints => { endpoints.MapGrpcService<MyEmployeeService>(); });
  }
  ```

+ 然后`MyEmployeeService`添加全局的认证

  ```csharp {4}
  namespace GrpcServer.Web.Services
  {
      [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //添加JWT验证
      public class MyEmployeeService : EmployeeService.EmployeeServiceBase
      {
          ...
      }
  }
  ```

+ 客户端默认还是设置请求`GetByNo`的接口

+ 运行

  可以看到，`gRPC`显示未授权，返回状态码是`401`，这表示服务器端的授权认证是生效了的

![image-20210117212823834](https://i.loli.net/2021/01/17/k4IU5NZbjyeEFtY.png)

### 接着

流程：我们需要添加服务器端的生成`Token`，客户端请求获取`Token`，然后通过`Token`请求接口，最后成功拿到数据

+ 首先，在`Message.proto`中添加新的服务，`CreateToken`，用于用户端请求生成`Token`，添加完成后，服务端，客户端需重新生成，否则会报错

  ```csharp
  syntax = "proto3";
  
  ...
  message TokenRequest{
  	string username=1;
  	string password=2;
  }
  
  message TokenResponse {
  	string token = 1;
  	google.protobuf.Timestamp expiration = 2;
  	bool success = 3;
  }
  
  service EmployeeService {
    ...
    rpc SaveAll(stream EmployeeRequest) returns (stream EmployeeResponse);
    //添加一个创建Token的服务
    rpc CreateToken(TokenRequest) returns (TokenResponse);
  }
  
  ```

+ 然后服务端，重写`CreateToken`方法

  ```csharp
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] //添加JWT验证
  public class MyEmployeeService : EmployeeService.EmployeeServiceBase
  {
      private readonly ILogger<MyEmployeeService> _logger;
      private readonly JwtTokenValidationService _tokenValidationService;
      
  	//JwtTokenValidationService.cs代码在下面
      //注入获取Token的服务
      public MyEmployeeService(ILogger<MyEmployeeService> logger, JwtTokenValidationService tokenValidationService)
      {
          _logger = logger;
          _tokenValidationService = tokenValidationService;
      }
  
      //重写创建Token方法
      [AllowAnonymous] //因为上面添加了验证 表示当前类所有方法都要验证，所以这里需要去掉（这里是创建验证的）
      public override async Task<TokenResponse> CreateToken(TokenRequest request, ServerCallContext context)
      {
          //
          var userModel = new JwtTokenValidationService.UserModel
          {
              UserName = request.Username,
              Password = request.Password,
          };
          //生成Token，具体方法在下面
          var response = await _tokenValidationService.GenerateTokenAsync(userModel);
  	
          //如果返回成功，则表示用户名、密码正确匹配，返回Token，以及过期时间
          if (response.Success)
          {
              return new TokenResponse
              {
                  Token = response.Token,
                  Expiration = Timestamp.FromDateTime(response.Expiration),
                  Success = true
              };
          }
          else
          {
              //不成功，则返回false
              return new TokenResponse
              {
                  Success = false
              };
          }
      }
      
      ...
  }
  ```

+ 因为创建`token`代码比较多，所以抽出一个单独的服务，`JwtTokenValidationService.cs`

  ```csharp
  using System;
  using System.ComponentModel.DataAnnotations;
  using System.IdentityModel.Tokens.Jwt;
  using System.Security.Claims;
  using System.Text;
  using System.Threading.Tasks;
  using GrpcServer.Web.Protos;
  using Microsoft.IdentityModel.Tokens;
  
  namespace GrpcServer.Web.Services
  {
      public class JwtTokenValidationService
      {
          //创建一个TokenModel，用于返回生成的Token信息
          public class TokenModel
          {
              public string Token { get; set; }
              public DateTime Expiration { get; set; }
              public bool Success { get; set; }
          }
          //创建UserModel，用于接收传入的用户信息
          public class UserModel
          {
              [Required] public string UserName { get; set; }
              [Required] public string Password { get; set; }
          }
  
          //生成Token
          public async Task<TokenModel> GenerateTokenAsync(UserModel model)
          {
              if (model.UserName == "admin" && model.Password == "1234")
              {
                  //创建一个声明（对应Token第二段，这个是我在博客园搜索看到的https://www.cnblogs.com/CreateMyself/p/11123023.html）
                  //其实就是自定义信息，比如里面存用户名、ID、角色等等，方便后面用的时候，取出
                  var clamis = new[]
                  {
                      new Claim(JwtRegisteredClaimNames.Sub, "email@123.com"),
                      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                      new Claim(JwtRegisteredClaimNames.UniqueName, "admin"),
                  };
                  //创建Token的关键，key，不能泄露！！！
                  var key = new SymmetricSecurityKey(
                      Encoding.UTF8.GetBytes("1-246542-123243-1422423-764-784-0642-47692-401234"));
  
                  //使用密钥及算法生成密钥证书
                  var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                  //根据相关信息生成token
                  var token = new JwtSecurityToken("localhost", "localhost", clamis, expires: DateTime.Now.AddMinutes(10),
                                                   signingCredentials: creds);
                  //返回token
                  return new TokenModel
                  {
                      Token = new JwtSecurityTokenHandler().WriteToken(token: token),
                      Expiration = token.ValidTo,
                      Success = true
                  };
              }
              //若用户名密码不正确，则返回false
              return new TokenModel
              {
                  Success = false
              };
          }
      }
  }
  ```

+ 创建了服务，需要在`Startup.cs`中注入一下

  ```csharp
  public class Startup
  {
      // This method gets called by the runtime. Use this method to add services to the container.
      // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
      public void ConfigureServices(IServiceCollection services)
      {
          //注入刚才创建的服务
          services.AddScoped<JwtTokenValidationService>();
  
          services.AddGrpc();
  
          services.AddAuthorization();
          //这里需要添加一些JWT认证的设置
          services.AddAuthentication()
              .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters = new TokenValidationParameters
                                {
                                    ValidIssuer = "localhost",
                                    ValidAudience = "localhost",
                                    //key
                                    IssuerSigningKey =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes("1-246542-123243-1422423-764-784-0642-47692-401234"))
                                };
                            });
      }
      ...
  }
  ```

+ 然后是客户端

  ```csharp
  class Program
  {
      //token，以及过期时间
      private static string _token;
      private static DateTime _expiration = DateTime.MinValue;
  
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
                      default:
                  break;
          }
  
          Console.WriteLine($"Press any key to exit.");
          Console.ReadKey();
  
          Log.CloseAndFlush();
      }
  
      //判断是否需要token
      //如果token是空，或者过期时间到了，就需要重新获取token
      private static bool NeedToken() => string.IsNullOrEmpty(_token) || _expiration > DateTime.UtcNow;
  
      //添加一些代码
      public static async Task GetByNoAsync(EmployeeService.EmployeeServiceClient client)
      {
          try
          {
              //判断是否需要token，若需要则重新获取
              if (!NeedToken() || await GetTokenAsync(client))
              {
                  var headers = new Metadata
                  {
                      {"Authorization", $"Bearer {_token}"},
                  };
  
                  var result = await client.GetByNoAsync(
                      new GetByNoRequest
                      {
                          No = 1994
                      }, headers);
                  Console.WriteLine($"Response message: {result}");
              }
          }
  
          catch (RpcException re)
          {
              if (re.StatusCode == StatusCode.DataLoss)
              {
                  Log.Logger.Error($"{re.Trailers}");
              }
  
              Log.Logger.Error(re.Message);
          }
      }
      //获取Token
      private static async Task<bool> GetTokenAsync(EmployeeService.EmployeeServiceClient client)
      {
          var request = new TokenRequest
          {
              Username = "admin",
              Password = "1234"
          };
          //请求服务端获取Token
          var response = await client.CreateTokenAsync(request);
          //成功，则更新token，更新过期时间，返回true
          if (response.Success)
          {
              _token = response.Token;
              _expiration = response.Expiration.ToDateTime();
              return true;
          }
  
          return false;
      }
      
      ...
  }
  ```

### 运行

![image-20210117225207540](https://i.loli.net/2021/01/17/cIEvoZqRmei2MCB.png)