# 从 v1 迁移

## Node.js 兼容性调整

在v2 中，最低 Node.js 版本为 20。

## 移除 Webpack 4 支持

在v2 中，移除了对 Webpack 4 以及 Vue CLI 4的支持。

## 插件配置项迁移

点击 [这里](/zh-CN/guide/configurations#plugin-options) 查看所有插件配置项。

| v1                      | v2                                             |
| ----------------------- | ---------------------------------------------- |
| ~~disableLaunchEditor~~   | `launchEditor?: boolean \| LaunchEditorOption` |
| ~~specifiedEditor~~       | `launchEditor?: boolean \| LaunchEditorOption` |
| ~~disableHighlight~~      | `highlight?: boolean \| HighlightOption`       |
| ~~port~~                  | `server: { port }`                             |
| ~~extendedPathFileNames~~ | `highlight?: boolean \|HighlightOption`        |
| ~~disablePassLogs~~       | `passLogs: boolean`                            |
| ~~silent~~                | `inspector?: boolean \| InspectorOption`        |
