# 配置

## 插件选项

<<< ../../../src/core/options/type.ts

## 局域网访问

通过局域网 IP 访问时，将浏览器页面的来源（协议、主机和端口）加入 `server.allowedOrigins`：

```ts
TurboConsole({
  server: {
    host: '0.0.0.0',
    allowedOrigins: ['http://192.168.1.10:5173', 'http://192.168.1.10:3070'],
  },
})
```

第一个地址是应用页面，第二个是 Inspector 页面；请替换为实际地址和端口。来源精确匹配，未列出的非本机来源仍被拒绝，身份验证保持启用。

## TypeScript

有两种方式来配置 TypeScript 类型：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["unplugin-turbo-console/client"]
  }
}
```

或者

```ts [*.d.ts]
/// <reference types="unplugin-turbo-console/client" />
```
