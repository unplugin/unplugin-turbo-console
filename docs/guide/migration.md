# Migration from v1

## Node.js Compatibility Changs

In v2, the minimum Node.js version is 20.

## Dropping Webpack 4 support

In v2, the support for Webpack 4 and Vue CLI 4 has been removed.

## Plugin Options Migration

Click [here](/guide/configurations#plugin-options) to view all plugin options.

| v1                      | v2                                             |
| ----------------------- | ---------------------------------------------- |
| ~~disableLaunchEditor~~   | `launchEditor?: boolean \| LaunchEditorOption` |
| ~~specifiedEditor~~       | `launchEditor?: boolean \| LaunchEditorOption` |
| ~~disableHighlight~~      | `highlight?: boolean \| HighlightOption`       |
| ~~port~~                  | `server: { port }`                             |
| ~~extendedPathFileNames~~ | `highlight?: boolean \|HighlightOption`        |
| ~~disablePassLogs~~       | `passLogs: boolean`                            |
| ~~silent~~                | `inspector?: boolean \| InspectorOption`        |
