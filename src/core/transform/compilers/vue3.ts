import type { CompileResult, Context } from '../../../types'
import { PLUGIN_NAME } from '../../constants'

export async function vue3Compiler(context: Context): Promise<CompileResult> {
  try {
    const { code, id } = context
    const { parse } = await import('vue/compiler-sfc')

    const compileResults = {
      script: '',
      line: 0,
      offset: 0,
      scriptLang: '',
    }

    const { descriptor, errors } = parse(code, {
      filename: id,
    })

    if (errors.length === 0) {
      if (descriptor.script) {
        compileResults.script = descriptor.script.content
        compileResults.scriptLang = descriptor.script.lang || 'js'
        const { line, offset } = descriptor.script.loc.start
        compileResults.line = line - 1
        compileResults.offset = offset
      }

      else if (descriptor.scriptSetup) {
        compileResults.script = descriptor.scriptSetup.content
        const { line, offset } = descriptor.scriptSetup.loc.start
        compileResults.scriptLang = descriptor.scriptSetup.lang || 'js'
        compileResults.line = line - 1
        compileResults.offset = offset
      }
    }

    return compileResults
  }
  catch (error) {
    console.error(`[${PLUGIN_NAME}]`, error)
    return {
      script: '',
      offset: 0,
      line: 0,
    }
  }
}
