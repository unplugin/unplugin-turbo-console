# 配置

## 插件选项

<<< ../../../src/core/options/type.ts

## TypeScript

有两种方式来配置 TypeScript 类型：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": [
      "unplugin-turbo-console/client"
    ]
  }
}
```

或者

```ts [*.d.ts]
/// <reference types="unplugin-turbo-console/client" />
```
