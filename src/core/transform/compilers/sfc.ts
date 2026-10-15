import type { CompileResult, Context, Lang } from '../../../types'
import { PLUGIN_NAME } from './../../constants'

export async function sfcCompiler(context: Context): Promise<CompileResult[]> {
  try {
    const { code } = context

    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const scriptRegex = /<script\s*([^>]*)>([\s\S]*?)<\/script>/g

    // e.g. Vue `<script>` + `<script setup>`, Svelte `<script module>` + `<script>`
    return Array.from(code.matchAll(scriptRegex), match => {
      const attrs = match[1] || ''
      const langMatch = attrs.match(/lang=["']([^"']*)["']/)
      const lang = langMatch ? langMatch[1] : 'js'
      const content = match[2]!
      // The content starts right after the opening tag, whose attributes contain no `>`.
      const offset = match.index + match[0].indexOf('>') + 1
      const line = code.substring(0, offset).split('\n').length - 1
      return {
        script: content,
        lang: lang as Lang,
        offset,
        line,
      }
    })
  } catch (error) {
    console.error(`${PLUGIN_NAME}:${error}`)
    return []
  }
}
