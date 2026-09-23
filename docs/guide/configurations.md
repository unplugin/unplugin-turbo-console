# Configurations

## Plugin Options

<<< ../../src/core/options/type.ts

## LAN Access

To access Turbo Console over your LAN, set `server.host` to your development machine's LAN IP address and add each browser page's origin (scheme, host, and port) to `server.allowedOrigins`:

```ts
TurboConsole({
  server: {
    host: '192.168.1.10',
    allowedOrigins: [
      'http://192.168.1.20:5173', // App page; needed only when importing ~console to forward logs
      'http://192.168.1.10:3070', // Inspector page
    ],
  },
})
```

## TypeScript

There are two ways to configure the TypeScript type:

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["unplugin-turbo-console/client"]
  }
}
```

Or

```ts [*.d.ts]
/// <reference types="unplugin-turbo-console/client" />
```
