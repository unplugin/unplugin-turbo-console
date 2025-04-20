# Configurations

## Plugin Options

<<< ../../src/core/options/type.ts

## TypeScript

There are two ways to configure the TypeScript type:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": [
      "unplugin-turbo-console/client"
    ]
  }
}
```

Or

```ts [*.d.ts]
/// <reference types="unplugin-turbo-console/client" />
```
