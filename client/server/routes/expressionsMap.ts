export default defineEventHandler(async () => {
  return {
    status: 'success',
    expressionsMap: {
      'src/App.vue': {
        filePath:
          '/Users/yuyin/Projects/github/unplugin/unplugin-turbo-console/examples/vite-vue3/src/App.vue',
        expressions: [
          { code: '\'from vue\'', method: 'log', line: 7, column: 2 },
        ],
      },
      'src/jsLog.js': {
        filePath:
          '/Users/yuyin/Projects/github/unplugin/unplugin-turbo-console/examples/vite-vue3/src/jsLog.js',
        expressions: [
          { code: '\'from js\'', method: 'info', line: 2, column: 2 },
          { code: '\'from js\'', method: 'warn', line: 4, column: 2 },
          { code: '\'from js\'', method: 'error', line: 6, column: 2 },
          { code: '\'from js\'', method: 'log', line: 8, column: 2 },
        ],
      },
      'src/tsLog.ts': {
        filePath:
          '/Users/yuyin/Projects/github/unplugin/unplugin-turbo-console/examples/vite-vue3/src/tsLog.ts',
        expressions: [
          { code: 'abc', method: 'log', line: 3, column: 2 },
          { code: 'def', method: 'log', line: 6, column: 2 },
          { code: 'mno', method: 'log', line: 15, column: 8 },
        ],
      },
    },
    version: '1.11.3',
  }
})
