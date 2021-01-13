---
title: C# 使用 ExcelDataReader导入Excel文件
date: 2020-09-10
categories:
 - 后端
tags:
 - C#
 - Excel导入
author: Ruan
---
### 需求

在使用`C#`内置的`OleDbConnection`导入文件时，需要依赖Access 12.0的一个安装包。必须要安装过后，才能正常导入，否则，就会出现导入失败的问题。

为了解决这个问题，采用了一种新的方案——第三方库，`ExcelDataReader`。

### 尝试

首先，肯定是找到`ExcelDataReader`，并且通过`Nuget`包管理器安装到需要使用的项目中

```bash
Install-Package ExcelDataReader
Install-Package ExcelDataReader.DataSet
```

然后查看GitHub对应的官方文档，看看具体怎么使用，[官网在这](https://github.com/ExcelDataReader/ExcelDataReader)。

由于我们需要考虑两种格式的文件都能成功导入，所以在使用的过程中，要判断后缀，采用两种方式创建`excelReader`，然后还有一些例如是否读取第一行，多个Sheet页的处理等等...，具体按自己的业务需求来，代码如下，写的烂，看看就好。

或者指出需要改进的地方，吸取一些好的方法，**谢谢**。

```csharp
public static DataTable ExcelToData(string filePath, string fileName, int sheetCount, ref string exStr)
{
    IExcelDataReader excelReader;
    DataTable dt = null;
    
    using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
    {
        if (fileName.Contains(".xlsx"))
        {
            //2. Reading from a OpenXml Excel file (2007 format; *.xlsx)
            excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
        }
        else
        {
            //1. Reading from a binary Excel file ('97-2003 format; *.xls)
            excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
        }
        try
        {
            var result = excelReader.AsDataSet(new ExcelDataSetConfiguration()
                                               {
                                                   //指定当前读取哪个sheet页
                                                   FilterSheet = (_, index) => { return index == sheetCount; },	
                                                   //额外配置，这里只用了过滤第一行，具体其他配置，官方有说明
                                                   ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                                                   {
                                                       UseHeaderRow = true,
                                                   }
                                               });
            excelReader.Close();
            if (result != null)
                return result.Tables[0];
            else
                return null;
        }
        catch (Exception ex)
        {
            excelReader.Close();
            throw;
        }
    }
}
```

### 说明

在开发中，遇到几个问题，需要注意：

+ 格式问题，如果对应文件格式不正确，可能导致`excelReader`报错
+ AsDataSet()不包含方法...，这时因为没有安装对应的ExcelDataReader.DataSet扩展包，安装即可。

