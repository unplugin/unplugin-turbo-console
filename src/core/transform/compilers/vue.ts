import { PLUGIN_NAME } from '../../constants'
import type { CompileResult, Context } from './../../../types'

export async function vueCompiler(context: Context): Promise<CompileResult> {
  try {
    const { code, id } = context
    const { parse } = await import('vue/compiler-sfc')

    const compileResults = {
      script: '',
      line: 0,
      offset: 0,
    }

    const { descriptor, errors } = parse(code, {
      filename: id,
    })

    if (errors.length === 0) {
      if (descriptor.script) {
        compileResults.script = descriptor.script.content
        const { line, offset } = descriptor.script.loc.start
        compileResults.line = line - 1
        compileResults.offset = offset
      }

      else if (descriptor.scriptSetup) {
        compileResults.script = descriptor.scriptSetup.content
        const { line, offset } = descriptor.scriptSetup.loc.start
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
