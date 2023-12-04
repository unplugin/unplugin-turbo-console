import path, { basename, dirname, resolve } from 'pathe'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
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

  const source = path.join(dirname(fileURLToPath(import.meta.url)), '../src/core/client')
  const target = path.join(dirname(fileURLToPath(import.meta.url)), '../dist/client')

  copy(source, target)
}

run()
