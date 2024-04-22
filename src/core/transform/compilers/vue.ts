import type { CompilerError, SFCDescriptor } from 'vue/compiler-sfc'
import { PLUGIN_NAME } from '../../constants'
import type { CompileResult, Context } from './../../../types'

export async function vueCompiler(context: Context): Promise<CompileResult> {
  try {
    const { code, id } = context

    const compileResults = {
      script: '',
      line: 0,
      offset: 0,
    }

    let descriptor: SFCDescriptor | undefined
    let errors: (CompilerError | SyntaxError)[] = []

    const Vue = await import('vue')

    if (!Vue || typeof Vue.version !== 'string') {
      throw new Error(`[${PLUGIN_NAME}]: Vue is not installed`)
    }
    else if (Vue.version.startsWith('2.')) {
      const { parse } = await import('vue/compiler-sfc')
      // @ts-expect-error vue2 compiler-sfc
      const _descriptor: any = parse({
        source: code,
        filename: id,
      })

      descriptor = _descriptor
      errors = _descriptor.errors
    }
    else if (Vue.version.startsWith('3.')) {
      const { parse } = await import('vue/compiler-sfc')
      const { descriptor: _descriptor, errors: _errors } = parse(code, {
        filename: id,
      })

      descriptor = _descriptor
      errors = _errors
    }
    else {
      throw new Error(`[${PLUGIN_NAME}]: Unsupported Vue version: ${Vue.version}`)
    }

    if (errors.length === 0) {
      if (descriptor?.script) {
        compileResults.script = descriptor.script.content
        const { line, offset } = descriptor.script.loc.start
        compileResults.line = line - 1
        compileResults.offset = offset
      }

      else if (descriptor?.scriptSetup) {
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
