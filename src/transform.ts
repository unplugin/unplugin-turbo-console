import { basename, extname } from 'node:path'

const transformFileTypes = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro']

export function transformCode(code: string, path: string) {
  let newCode = ''
  if (transformFileTypes.includes(extname(path)) && !path.includes('node_modules')) {
    const lines = code.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*console\.log/.test(lines[i])) {
        const consoleContent = lines[i].match(/s*console\.log\((\w+)\)/)
        if (consoleContent)
          newCode += `console.log('🚀 ~ file: ${basename(path)} ~ ${consoleContent[1]}:', ${consoleContent[1]})`
        else
          newCode += `${lines[i]}\n`
      }

      else {
        newCode += `${lines[i]}\n`
      }
    }
  }
  else {
    newCode = code
  }

  return newCode
}
