# Launch Editor

By clicking the links in the log output, you can automatically open the code editor and jump to the line of the console statement in the source code:

![launch-editor](https://static.yuy1n.io/launch-editor.gif)

## Options

```js
// Disable launch editor feature
TurboConsole({
  launchEditor: false,
})

// Specify the editor
TurboConsole({
  launchEditor: {
    specifiedEditor: 'webstorm',
  },
})
```

## In-depth: How It Works

A clickable link usually looks like this:

<span class="bg-#00DC8250 px-5px py-2px rd-5px">
🔦
<a href="">
http://127.1:3070#3abe,6,3
</a>
</span>

> `127.1` is the abbreviation of `127.0.0.1`

It consists of the following parts:

- `#3abe,6,3`: A hash attribute in the URL, where `3abe` is a randomly generated string corresponding to a specific file in the project, and `6`,`3` is the line and column numbers of the console statement in the source code.

- `http://127.1:3070`: A static page, It will send the hash attribute to the Node.js service. The Node.js service obtains the specific file path and row number, and then opens the editor through [launch-editor](https://github.com/yyx990803/launch-editor).
