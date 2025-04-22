# 编辑器跳转

通过点击日志输出中的链接，可以自动打开代码编辑器并跳转到`console`源代码所在行：

![launch-editor](https://static.yuy1n.io/launch-editor.gif)

## 配置项

```js
// 禁用编辑器跳转功能
TurboConsole({
  launchEditor: false,
})

// 指定打开的编辑器
TurboConsole({
  launchEditor: {
    specifiedEditor: 'webstorm',
  },
})
```

## 深入：它是如何工作的

一个可点击的链接通常长这样：

<span class="bg-#00DC8250 px-5px py-2px rd-5px">
🔦
<a href="">
http://127.1:3070#3abe,6,3
</a>
</span>

> `127.1` 是 `127.0.0.1` 的缩写

它由以下几部分组成：

- `#3abe,6,3`: 一个包含在URL中的hash属性，其中`3abe`是一个随机生成字符串，对应项目中的一个具体文件，`6`与`3`分别代表`console`源代码所在的行号和列号。

- `http://127.1:3070`: 一个静态页面，它的作用是将 hash 属性发送给 Node.js 服务，Node.js 服务获取到具体的文件路径和行列号，再通过[launch-editor](https://github.com/yyx990803/launch-editor)打开编辑器。
