# Configurations

## Plugin options

|  Attribute       |      Type      | Default | Description |
| ------------- | :-----------: | ----: | ------------- |
| prefix / suffix    | `string` | `""` | [custom prefix and suffix](/features/custom-prefix) |
| disableLaunchEditor |   `boolean`   | `false` | Wheather to disable [launch editor](/features/launch-editor) feature |
| specifiedEditor | `string` | `""` | Specify the editor. [All supported editors](https://github.com/yyx990803/launch-editor#supported-editors) |
| disableHighlight      |   `boolean`   | `false` | Wheather to disable [highlight output](/features/highlight) feature |
| port | `number` | `3070` | Specify the plugin's service port number |
| extendedPathFileNames | `string[]` | `[]` | [Extended path file names](/features/highlight.html#expand-path-file-name) |
| babelParserPlugins | `ParserPlugin[]` | `["typescript", "jsx"]` | The incoming value will be automatically merged with the default value. [All babel parser plugins](https://babeljs.io/docs/en/babel-parser#plugins) |
| disablePassLogs      |   `boolean`   | `false` | Wheather to disable [Pass Logs](/features/pass-logs) feature |
| silent | `boolean` | `false` | Avoid the plugin's terminal output at project startup |

## TypeScript

There are two ways to configure the TypeScript type:

1. On `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-turbo-console/client"
    ]
  }
}
```

2. On `.d.ts` file:

```ts
/// <reference types="unplugin-turbo-console/client" />
```
