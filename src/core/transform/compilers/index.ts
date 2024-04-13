import type { CompileResult, Compiler, Context } from '../../../types'
import { vueCompiler } from './vue'
import { vanillaCompiler } from './vanilla'
import { svelteCompiler } from './svelte'

export const compilers: Record<Compiler, (context: Context) => Promise<CompileResult>> = {
  vue: vueCompiler,
  vanilla: vanillaCompiler,
  svelte: svelteCompiler,
}
