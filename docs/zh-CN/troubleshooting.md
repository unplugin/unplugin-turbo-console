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
