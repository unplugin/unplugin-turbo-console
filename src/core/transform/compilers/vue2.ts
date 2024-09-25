import type { CompileResult, Context } from '../../../types'
import { PLUGIN_NAME } from '../../constants'

export async function vue2Compiler(context: Context): Promise<CompileResult> {
  try {
    const { code, id } = context
    const { parse } = await import('vue/compiler-sfc')

    const compileResults = {
      script: '',
      line: 0,
      offset: 0,
    }

    // @ts-expect-error vue2 compiler-sfc
    const descriptor: any = parse({
      source: code,
      filename: id,
    })

    if (descriptor.errors.length === 0) {
      if (descriptor.script) {
        compileResults.script = descriptor.script.content
        const offset = descriptor.script.start
        const line = code.slice(0, offset).split('\n').length
        compileResults.line = line
        compileResults.offset = offset
      }
      else if (descriptor.scriptSetup) {
        compileResults.script = descriptor.scriptSetup.content
        const offset = descriptor.scriptSetup.start
        const line = code.slice(0, offset).split('\n').length
        compileResults.line = line
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
