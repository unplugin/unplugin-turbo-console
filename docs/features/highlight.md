# Highlight Output

Highlight Console output based on file types (such as `.js(x)`, `.ts(x)`, `.vue`, `.svelte`, `.astro`). It includes filename, line number, variable name.

![feature-highlight](/features/highlight.png)

> You can disable this feature by setting `disableHighlight: true`.
>
> This feature will be automatically disabled on build time.

## Expand path file name

Consider having a project file directory as follows:

```
pages
├── bar
│   └── index.vue
├── foo
│   └── index.vue
└── index.vue
```

Additionally, in every `index.vue`, there is a console statement. By default, the highlighted output will have the filename as `index.vue`, which can reduce the readability of the output. By configuring `extendedPathFileNames: ['index']`, the output can include the path information:

![extend-name](/features/extend-name.png)
