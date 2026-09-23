# 配置

## 插件选项

<<< ../../../src/core/options/type.ts

## 局域网访问

通过局域网 IP 访问时，将 `server.host` 设为开发机的局域网 IP，并将浏览器页面的来源（协议、主机和端口）加入 `server.allowedOrigins`：

```ts
TurboConsole({
  server: {
    host: '192.168.1.10',
    allowedOrigins: [
      'http://192.168.1.20:5173', // 应用页面，引入 ~console 传递日志时才需要
      'http://192.168.1.10:3070', // Inspector 页面
    ],
  },
})
```

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
