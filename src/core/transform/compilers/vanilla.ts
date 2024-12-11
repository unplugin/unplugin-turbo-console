import type { CompileResult, Context, Lang } from '../../../types'
import { extname } from 'pathe'

export async function vanillaCompiler(context: Context): Promise<CompileResult> {
  const { code, id } = context
  const urlObject = new URL(id, 'file://')
  const fileType = extname(urlObject.pathname)

  return {
    script: code,
    lang: fileType.replace('.', '') as Lang,
    offset: 0,
    line: 0,
  }
}
