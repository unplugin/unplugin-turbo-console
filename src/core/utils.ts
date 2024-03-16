import { extname } from 'node:path'
import { sep } from 'pathe'
import { createFilter } from '@rollup/pluginutils'

export const filter = createFilter(
  [/\.vue$/, /\.vue\?vue/, /\.vue\?v=/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/, /\.svelte$/],
  [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
)

const commonStyle = 'padding:2px 5px; border-radius:3px 0 0 3px;margin-bottom:5px;'

const consoleStyles: Record<string, string> = {
  '.js': `${commonStyle}color: #111827; background: #F7DF1E`,
  '.jsx': `${commonStyle}color: #111827; background: #F7DF1E`,
  '.ts': `${commonStyle}color: #fff; background: #3178C6`,
  '.tsx': `${commonStyle}color: #fff; background: #3178C6`,
  '.vue': `${commonStyle}color: #fff; background: #4FC08D`,
  '.svelte': `${commonStyle}color: #fff; background: #FF3E00`,
  '.astro': `${commonStyle}color: #fff; background: #FF5D01`,
  'default': `${commonStyle}color: #111827; background: #F7DF1E`,
}

const firstLineCommentRegex: Record<string, RegExp> = {
  '.js': /^\s*\/\*\s*(turbo-console-disable)\s*\*\/\s*$/,
  '.jsx': /^\s*\/\*\s*(turbo-console-disable)\s*\*\/\s*$/,
  '.ts': /^\s*\/\*\s*(turbo-console-disable)\s*\*\/\s*$/,
  '.tsx': /^\s*\/\*\s*(turbo-console-disable)\s*\*\/\s*$/,
  '.vue': /^\s*\<\!\-\-\s*(turbo-console-disable)\s*\-\-\>\s*$/,
  '.svelte': /^\s*\<\!\-\-\s*(turbo-console-disable)\s*\-\-\>\s*$/,
  '.astro': /^\s*\<\!\-\-\s*(turbo-console-disable)\s*\-\-\>\s*$/,
  'default': /^\s*\/\*\s*(turbo-console-disable)\s*\*\/\s*$/,
}

export function getConsoleStyle(fileType: string): string {
  return consoleStyles[fileType] ?? consoleStyles.default
}

export function getFirstLineCommentRegex(fileType: string): RegExp {
  return firstLineCommentRegex[fileType] ?? firstLineCommentRegex.default
}

export const launchEditorStyle = 'background: #00DC8250;padding:2px 5px;border-radius:0 3px 3px 0;margin-bottom:5px'

type Framework = 'rollup' | 'vite' | 'webpack' | 'esbuild' | 'rspack'

export const getEnforce: Record<Framework, 'pre' | 'post'> = {
  rollup: 'post',
  vite: 'post',
  webpack: 'pre',
  esbuild: 'post',
  rspack: 'pre',
}

export function printInfo(port: number) {
  // eslint-disable-next-line no-console
  console.log('\x1B[32m%s\x1B[0m\x1B[1m%s\x1B[0m\x1B[36m%s\x1B[0m', '  ➜', `  TurboConsole:`, ` http://localhost:${port}/intro`)
}

export function getFileNameWithoutExtension(fileName: string) {
  if (!fileName)
    return ''
  return fileName.replace(/\.[^/.]+$/, '')
}

export function getExtendedPath(filePath: string, extendedPathFileNames?: string[]) {
  const arr = filePath.split(sep)
  let basename = arr.pop() || ''
  const basenameWithoutExt = getFileNameWithoutExtension(basename).toLowerCase()
  if (extendedPathFileNames && extendedPathFileNames?.length > 0) {
    let isEnd = false
    if (extendedPathFileNames.some(name => basenameWithoutExt === name.toLowerCase())) {
      while (!isEnd) {
        const fileName = arr.pop()
        basename = `${fileName}/${basename}`
        if (extendedPathFileNames.every(name => name.toLowerCase() !== fileName?.toLowerCase()))
          isEnd = true
      }
    }
  }
  return basename
}

export function isPluginDisable({ lineContentArr, originalLine, id }: { lineContentArr: string[], originalLine: number, id: string }) {
  const urlObject = new URL(id, 'file://')
  const filePath = urlObject.pathname
  const fileType = extname(filePath)

  // if the file starts with "/* turbo-console-disable */" then return
  const firstLineRegex = getFirstLineCommentRegex(fileType)
  const firstLineContent = lineContentArr.filter((i: string) => i)[0]
  if (firstLineContent && firstLineRegex.test(firstLineContent))
    return true

  // if the line above the console is "// turbo-console-disable-next-line" or "/* turbo-console-disable-next-line */" then return
  const prevLineRegex1 = /^\s*\/\*\s*(turbo-console-disable-next-line)\s*\*\/\s*$/
  const prevLineRegex2 = /^\s*\/\/\s*(turbo-console-disable-next-line)\s*$/
  const prevLineContent = lineContentArr[originalLine - 1 - 1]
  if (prevLineRegex1.test(prevLineContent) || prevLineRegex2.test(prevLineContent))
    return true

  // if the line comment includes "// turbo-console-disable-line" or "/* turbo-console-disable-line */" then return
  const lineRegex1 = /.*\/\*\s*(turbo-console-disable-line)\s*\*\/\s*$/
  const lineRegex2 = /.*\/\/\s*(turbo-console-disable-line)\s*$/
  const lineContent = lineContentArr[originalLine - 1]
  if (lineRegex1.test(lineContent) || lineRegex2.test(lineContent))
    return true
}
