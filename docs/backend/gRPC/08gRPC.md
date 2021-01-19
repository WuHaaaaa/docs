---
title: 客户端证书
---



## 前言

接前面一篇，这篇主要是关于服务端与客户端使用证书认证

## 正文

+ 找到可用于生成证书的执行命令

  ```powershell
  Write-Host "Creating Certificates for Self-Signed Testing"
  
  Write-Host "Creating Root Certificate"
  $cert = New-SelfSignedCertificate -Type Custom -KeySpec Signature `
  -Subject "CN=localhost" `
  -FriendlyName "gRPCDemoRootCert" `
  -KeyExportPolicy Exportable `
  -HashAlgorithm sha256 -KeyLength 4096 `
  -CertStoreLocation "Cert://CurrentUser/My" `
  -KeyUsageProperty Sign `
  -KeyUsage CertSign `
  -NotAfter (Get-Date).AddYears(5)
  
  # Client Auth
  Write-Host "Creating Client Auth Certificate"
  $clientCert = New-SelfSignedCertificate -Type Custom -KeySpec Signature `
  -Subject "CN=localhost" -KeyExportPolicy Exportable `
  -FriendlyName "gRPCDemoClientCert" `
  -HashAlgorithm sha256 -KeyLength 2048 `
  -NotAfter (Get-Date).AddMonths(24) `
  -CertStoreLocation "Cert://CurrentUser/My" `
  -Signer $cert -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.2")
  
  # TLS Cert
  Write-Host "Creating Web Server Certificate"
  $webCert = New-SelfSignedCertificate -Type Custom `
  -Subject "CN=localhost" -KeyExportPolicy Exportable `
  -DnsName "localhost" `
  -FriendlyName "gRPCDemoTlsCert" `
  -HashAlgorithm sha256 -KeyLength 2048 `
  -KeyUsage "KeyEncipherment", "DigitalSignature" `
  -NotAfter (Get-Date).AddMonths(24) `
  -CertStoreLocation "Cert://CurrentUser/My" `
  -Signer $cert
  
  $PFXPass = ConvertTo-SecureString -String "P@ssw0rd!" -Force -AsPlainText
  
  Write-Host "Exporting Certificates to File"
  
  Export-PfxCertificate -Cert $clientCert `
  -Password $PFXPass `
  -FilePath gRPCDemoSelfCert.pfx
  
  Export-PfxCertificate -Cert $webCert `
  -Password $PFXPass `
  -FilePath gRPCDemoSslCert.pfx
  ```

+ 执行命令（找个空文件夹，也可以随便一个地方，执行生成证书）

  ```powershell
  PS E:\C#\GrpcServer.Client_GeneratorCertificate> .\generate_certs.ps1
  Creating Certificates for Self-Signed Testing
  Creating Root Certificate
  Creating Client Auth Certificate
  Creating Web Server Certificate
  Exporting Certificates to File
  
  
      目录: E:\C#\GrpcServer.Client_GeneratorCertificate
  
  
  Mode                 LastWriteTime         Length Name
  ----                 -------------         ------ ----
  -a----         2021/1/18     23:01           4238 gRPCDemoSelfCert.pfx
  -a----         2021/1/18     23:01           4230 gRPCDemoSslCert.pfx
  
  
  PS E:\C#\GrpcServer.Client_GeneratorCertificate>
  ```

  然后可以看到，生成的两个证书文件

  ![image-20210118230614939](https://i.loli.net/2021/01/18/p6awq8rLjHJYvex.png)

  如果执行的时候，有问题，则需要设置一个命令来执行

  <img src="https://i.loli.net/2021/01/18/bkxKyNgQzYWoDOj.png" alt="image-20210118230946862" style="zoom:50%;" />

+ 将`SSL`证书放在`Server`下面，`Self`证书放在`Client`下面，（并设置文件属性：**复制到输出目录>如果较新则复制**）

  ![image-20210118232648802](K:/Blog/docs/.vuepress/public/images/image-20210118232648802.png)

+ 然后还剩下一步：`[win]`->搜索`管理用户证书`，打开，框选的就是刚生成的证书

  我们需要将`root`证书移动到**受信任的根证书颁发机构**

  ![image-20210118232016945](K:/Blog/docs/.vuepress/public/images/image-20210118232016945.png)

+ 找到`Server`端代码

  ```csharp {13-22}
  public class Program
  {
      public static void Main(string[] args)
      {
          CreateHostBuilder(args).Build().Run();
      }
  
      public static IHostBuilder CreateHostBuilder(string[] args) =>
          Host.CreateDefaultBuilder(args)
              .ConfigureWebHostDefaults(webBuilder =>
              {
                  webBuilder.UseStartup<Startup>();
                  webBuilder.ConfigureKestrel(opt =>
                  {
                      var cert = new X509Certificate2("gRPCDemoSslCert.pfx", "P@ssw0rd!");
                      opt.ConfigureHttpsDefaults(h =>
                      {
                          h.ClientCertificateMode = ClientCertificateMode.AllowCertificate;
                          h.CheckCertificateRevocation = false; //使用自签名证书，所以设置false
                          h.ServerCertificate = cert;
                      });
                  });
              });
  }
  ```

+ 添加一个`NuGet`包：`Microsoft.AspNetCore.Authentication.Certificate`，`Startup.cs`添加一些代码

  ```csharp {21-33}
   public class Startup
      {
          // This method gets called by the runtime. Use this method to add services to the container.
          // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
          public void ConfigureServices(IServiceCollection services)
          {
              services.AddScoped<JwtTokenValidationService>();
  
              services.AddGrpc();
  
              services.AddAuthorization();
              services.AddAuthentication()
                  .AddJwtBearer(options =>
                  {
                      options.TokenValidationParameters = new TokenValidationParameters
                      {
                          ValidIssuer = "localhost",
                          ValidAudience = "localhost",
                          IssuerSigningKey =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes("1-246542-123243-1422423-764-784-0642-47692-401234"))
                      };
                  }).AddCertificate(opt =>
                  {
                      opt.AllowedCertificateTypes = CertificateTypes.SelfSigned;
                      opt.RevocationMode = X509RevocationMode.NoCheck;
                      opt.Events = new CertificateAuthenticationEvents
                      {
                          OnCertificateValidated = context =>
                          {
                              context.Success();
                              return Task.CompletedTask;
                          }
                      };
                  });
          }
  
          ...
      }
  ```

+ 然后需要修改一下`MyEmployeeService.cs`

  ```csharp {1}
  [Authorize(AuthenticationSchemes = CertificateAuthenticationDefaults.AuthenticationScheme)] //添加JWT验证
  public class MyEmployeeService : EmployeeService.EmployeeServiceBase
  {
      private readonly ILogger<MyEmployeeService> _logger;
      private readonly JwtTokenValidationService _tokenValidationService;
  
      public MyEmployeeService(ILogger<MyEmployeeService> logger, JwtTokenValidationService tokenValidationService)
      {
          _logger = logger;
          _tokenValidationService = tokenValidationService;
      }
      ...
  }
  ```

+ 运行（出现403，表示认证生效了）

  ![image-20210118234319252](K:/Blog/docs/.vuepress/public/images/image-20210118234319252.png)

+ 添加客户端证书

  ```csharp {10-14,20}
  static async Task Main(string[] args)
  {
      Log.Logger = new LoggerConfiguration()
          .MinimumLevel.Debug()
          .WriteTo.Console()
          .CreateLogger();
  
      Log.Information("Client starting...");
  
      var cert = new X509Certificate2("gRPCDemoSelfCert.pfx", "P@ssw0rd!");
      var handler = new HttpClientHandler();
      handler.ClientCertificates.Add(cert);
  
      var httpClient = new HttpClient(handler);
  
      using var channel = GrpcChannel.ForAddress("https://localhost:5001",
                                                 new GrpcChannelOptions
                                                 {
                                                     LoggerFactory = new SerilogLoggerFactory(),
                                                     HttpClient = httpClient	//将创建的Client放到这里
                                                 });
      ...
  }
  
  ...
  public static async Task GetByNoAsync(EmployeeService.EmployeeServiceClient client)
  {
      try
      {
          //由于是证书认证，我们可以暂时去掉不需要的代码
          // if (!NeedToken() || await GetTokenAsync(client))
          // {
          //     var headers = new Metadata
          //     {
          //         {"Authorization", $"Bearer {_token}"},
          //     };
  
          var result = await client.GetByNoAsync(
              new GetByNoRequest
              {
                  No = 1994
              } /*, headers*/);
          Console.WriteLine($"Response message: {result}");
          // }
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
  ```

+ 运行

  ![image-20210119231410156](K:/Blog/docs/.vuepress/public/images/image-20210119231410156.png)