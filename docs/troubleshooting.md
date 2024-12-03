# Troubleshooting

## Launch Editor Not Working

If you encounter the following error and are using VS Code:

```
Could not open xxxx in the editor.

The editor process exited with an error: spawn code ENOENT.
```

This may be because you have not installed the `code` command. You can refer to [this guide](https://code.visualstudio.com/docs/setup/mac#_launching-from-the-command-line) to install it.

## How to Disable the Plugin for Specific console Statements

You can disable it using comments:

- For a single line of code:

```js
// turbo-console-disable-next-line
console.log('foo')
console.log('bar') // turbo-console-disable-line
```

- For an entire file:

```js
/* turbo-console-disable Add it on the first line of the file) */
console.log('foo')
console.log('bar')
```
