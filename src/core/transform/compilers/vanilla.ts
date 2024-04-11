import type { CompileResult, NewContext } from '../../../types'

export async function vanillaCompiler(context: NewContext): Promise<CompileResult> {
  return {
    script: context.code,
    offset: 0,
    column: 0,
    line: 0,
  }
}
