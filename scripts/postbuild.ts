import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join, resolve } from 'pathe'
import fg from 'fast-glob'
import chalk from 'chalk'
import { copy } from 'fs-extra'

async function run() {
  // fix cjs exports
  const files = await fg('*.cjs', {
    ignore: ['chunk-*'],
    absolute: true,
    cwd: resolve(dirname(fileURLToPath(import.meta.url)), '../dist'),
  })
  for (const file of files) {
    console.log(chalk.cyan.inverse(' POST '), `Fix ${basename(file)}`)
    let code = await fs.readFile(file, 'utf8')
    code = code.replace('exports.default =', 'module.exports =')
    code += 'exports.default = module.exports;'
    await fs.writeFile(file, code)
  }

  const helperFile = join(dirname(fileURLToPath(import.meta.url)), '../dist/helper.js')
  let helperCode = await fs.readFile(helperFile, 'utf8')
  helperCode = `// turbo-console-disable\n${helperCode}`
  await fs.writeFile(helperFile, helperCode)

  const source = join(dirname(fileURLToPath(import.meta.url)), '../src/core/client')
  const target = join(dirname(fileURLToPath(import.meta.url)), '../dist/client')

  copy(source, target)
}

run()
