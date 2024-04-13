import type { CompileResult, Context } from '../../../types'

export async function vanillaCompiler(context: Context): Promise<CompileResult> {
  return {
    script: context.code,
    offset: 0,
    column: 0,
    line: 0,
  }
}
