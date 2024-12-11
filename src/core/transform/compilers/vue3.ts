import type { CompileResult, Context, Lang } from '../../../types'
import { PLUGIN_NAME } from '../../constants'

export async function vue3Compiler(context: Context): Promise<CompileResult> {
  try {
    const { code, id } = context
    const { parse } = await import('vue/compiler-sfc')

    const compileResults: CompileResult = {
      script: '',
      line: 0,
      offset: 0,
      lang: 'js',
    }

    const { descriptor, errors } = parse(code, {
      filename: id,
    })

    if (errors.length === 0) {
      if (descriptor.script) {
        compileResults.script = descriptor.script.content
        compileResults.lang = (descriptor.script.lang as Lang)
        const { line, offset } = descriptor.script.loc.start
        compileResults.line = line - 1
        compileResults.offset = offset
      }

      else if (descriptor.scriptSetup) {
        compileResults.script = descriptor.scriptSetup.content
        const { line, offset } = descriptor.scriptSetup.loc.start
        compileResults.lang = (descriptor.scriptSetup.lang as Lang)
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
      lang: 'js',
      offset: 0,
      line: 0,
    }
  }
}
