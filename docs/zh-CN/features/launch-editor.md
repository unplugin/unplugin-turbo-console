# 编辑器跳转

通过点击日志输出中的链接，可以自动打开代码编辑器并跳转到`console`源代码所在行：

![launch-editor](https://static.yuy1n.io/launch-editor.gif)

> 可以通过配置项 `disableLaunchEditor: true` 来禁用此功能。
>
> 可以通过配置项 `specifiedEditor` 来指定编辑器，如`webstorm`。
>
> 此功能在打包时会自动被禁用。

## 深入：它是如何工作的

一个可点击的链接通常长这样：

<span class="bg-#00DC8250 px-5px py-2px rd-5px">
🔦
<a href="">
http://localhost:3070#3abe,6,3
</a>
</span>

它由以下几部分组成：

- `#3abe,6,3`: 一个包含在URL中的hash属性，其中`3abe`是一个随机生成字符串，对应项目中的一个具体文件，`6`与`3`分别代表`console`源代码所在的行号和列号。

- `http://localhost:3070`: 一个[静态页面](https://github.com/unplugin/unplugin-turbo-console/blob/main/src/core/client/index.html)，它的作用是将 hash 属性发送给 Node.js 服务，Node.js 服务获取到具体的文件路径和行列号，再通过[launch-editor](https://github.com/yyx990803/launch-editor)打开编辑器。

::: tip 提示

你可能注意到了在启动项目时终端中会打印一个额外的链接：

```
➜  TurboConsole: http://localhost:3070/inspect
```

你可以通过打开这个链接来查看目前所有生成的随机字符串与文件之间的对应关系，并通过点击链接来测试跳转功能是否正常。

![inspect](/features/inspect.png)

:::
