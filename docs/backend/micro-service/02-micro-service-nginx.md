---
title: 微服务前身——Nginx
---
## 介绍

主要用于负载均衡，客户端访问Nginx，Nginx转发响应的请求到对应的服务，然后返回数据给客户端

由于Nginx支持负载均衡策略，所以可以很灵活的调整到底使用轮询、权重、还是其他更高级的策略

但是由于Nginx需要配置才能使用，所以人力维护成本过高，而且，每次更新配置后，需要重启服务，这也造成了极大不方便，也无法针对某个服务掉线做特殊处理，掉线了，或者新增了服务，需要手动更新Nginx配置

