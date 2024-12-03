import type { CompileResult, Context } from '../../../types'
import { PLUGIN_NAME } from './../../constants'

export async function svelteCompiler(context: Context): Promise<CompileResult> {
  try {
    const { code } = context

    const scriptRegex = /<script(?:\s+lang="(\w+)")?>([\s\S]*?)<\/script>/

    const match = scriptRegex.exec(code)
    if (match) {
      const lang = match[1]
      const content = match[2]
      const offset = code.indexOf(content)
      const line = offset ? code.substring(0, offset).split('\n').length - 1 : 0
      return {
        script: content,
        scriptLang: lang,
        offset,
        line,
      }
    }

    return {
      script: '',
      offset: 0,
      line: 0,
    }
  }
  catch (error) {
    console.error(`${PLUGIN_NAME}:${error}`)
    return {
      script: '',
      offset: 0,
      line: 0,
    }
  }
}
