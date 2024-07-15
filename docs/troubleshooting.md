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

## Compilation Syntax Errors

If you use some unstable ECMAScript syntax, you might see errors like the following in the terminal:

```
[unplugin-turbo-console] Transform src/App.vue error: SyntaxError:
This experimental syntax requires enabling the parser plugin: "importAttributes". (5:39)
```

To resolve this, add the missing Babel parser plugin to `babelParserPlugins`:

```js{2,7} twoslash
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

> Related [issus](https://github.com/unplugin/unplugin-turbo-console/issues/35)
