# 常见问题

## 编辑器跳转无法正常工作

如果你遇到了以下错误并且正在使用VS Code:

```
Could not open xxxx in the editor.

The editor process exited with an error: spawn code ENOENT.
```

这可能是因为你没有安装`code`命令，可以参考[这里](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line)进行安装。

## 如何为某些特定的 `console` 语句禁用插件

你可以通过注释实现：

- 单行代码禁用:

```js
// turbo-console-disable-next-line
console.log('foo')
console.log('bar') // turbo-console-disable-line
```

- 整个文件禁用

```js
/* turbo-console-disable (文件第一行) */
console.log('foo')
console.log('bar')
```

## 编译语法错误

如果你使用了一些未稳定的ECMAScript语法，你可能会在终端看到类似错误：

```
[unplugin-turbo-console] Transform src/App.vue error: SyntaxError:
This experimental syntax requires enabling the parser plugin: "importAttributes". (5:39)
```

解决方法是将缺失的 babel parser 插件添加到`babelParserPlugins`中：

```js{2,7} twoslash [vite.config.ts]
import { defineConfig } from 'vite'
import TurboConsole from 'unplugin-turbo-console/vite'

export default defineConfig({
  plugins: [
    TurboConsole({
      babelParserPlugins: ['importAttributes'],
    }),
  ],
})
```

> 相关 [issus](https://github.com/unplugin/unplugin-turbo-console/issues/35)
