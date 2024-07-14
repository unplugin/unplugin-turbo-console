# Launch Editor

By clicking the links in the log output, you can automatically open the code editor and jump to the line of the console statement in the source code:

![launch-editor](/features/launch-editor.gif)

> You can disable this feature by setting `disableLaunchEditor: true`.
>
> You can specify the editor, such as `webstorm`, by setting `specifiedEditor`.
>
> This feature will be automatically disabled on build time.

## In-depth: How It Works

A clickable link usually looks like this:

<span class="bg-#00DC8250 px-5px py-2px rd-5px">
🔦
<a href="">
http://localhost:3070#3abe,6,3
</a>
</span>

It consists of the following parts:

- `#3abe,6,3`: A hash attribute in the URL, where `3abe` is a randomly generated string corresponding to a specific file in the project, and `6`,`3` is the line and column numbers of the console statement in the source code.

- `http://localhost:3070`: A [static page](https://github.com/unplugin/unplugin-turbo-console/blob/main/src/core/client/index.html), It will send the hash attribute to the Node.js service. The Node.js service obtains the specific file path and row number, and then opens the editor through [launch-editor](https://github.com/yyx990803/launch-editor).

::: tip

You might notice an extra link printed in the terminal when starting the project:

```
➜  TurboConsole: http://localhost:3070/inspect
```

You can open this link to see the current mapping between randomly generated strings and files. You can also test whether the navigation feature is working properly by clicking the links.

![inspect](/features/inspect.png)

:::
