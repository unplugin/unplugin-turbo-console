import type { CompileResult, Context, Lang } from '../../../types'
import { PLUGIN_NAME } from './../../constants'

export async function sfcCompiler(context: Context): Promise<CompileResult> {
  try {
    const { code } = context

    const scriptRegex = /<script\s*([^>]*)>([\s\S]*?)<\/script>/

    const match = scriptRegex.exec(code)
    if (match) {
      const attrs = match[1] || ''
      const langMatch = attrs.match(/lang=["']([^"']*)["']/)
      const lang = langMatch ? langMatch[1] : 'js'
      const content = match[2]
      const offset = code.indexOf(content)
      const line = offset ? code.substring(0, offset).split('\n').length - 1 : 0
      return {
        script: content,
        lang: lang as Lang,
        offset,
        line,
      }
    }

    return {
      script: '',
      lang: 'js',
      offset: 0,
      line: 0,
    }
  }
  catch (error) {
    console.error(`${PLUGIN_NAME}:${error}`)
    return {
      script: '',
      lang: 'js',
      offset: 0,
      line: 0,
    }
  }
}
