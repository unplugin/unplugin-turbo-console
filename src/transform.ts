import { basename, extname } from 'node:path'

const transformFileTypes = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro']

export function transformCode(code: string, path: string) {
  let newCode = ''
  if (transformFileTypes.includes(extname(path)) && !path.includes('node_modules')) {
    const lines = code.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*console\.log\([^\)]*\)\s*;?\s*$/.test(lines[i])) {
        const consoleContent = lines[i].match(/s*console\.log\((.+)\)/)
        if (consoleContent)
          newCode += `console.log('%c${basename(path)}:${i + 1} ~ ${consoleContent[1]}:', '${consoleStyle(extname(path))}' ,${consoleContent[1]})\n`
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

function consoleStyle(fileType: string): string {
  let styleString = 'padding:4px; border-radius:5px; font-weight:600; '
  switch (fileType) {
    case '.js':
    case '.jsx':
      styleString += 'color: #111827; background:#F7DF1E'
      break
    case '.ts':
    case '.tsx':
      styleString += 'color: #fff; background:#3178C6'
      break
    case '.vue':
      styleString += 'color: #fff; background:#4FC08D'
      break
    case '.svelte':
      styleString += 'color: #fff; background:#FF3E00'
      break
    case '.astro':
      styleString += 'color: #fff; background:#FF5D01'
      break
    default:
      styleString += 'color: #111827; background:#F7DF1E'
      break
  }

  return styleString
}
