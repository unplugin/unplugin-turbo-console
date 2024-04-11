import type { CompileResult, Compiler, NewContext } from '../../../types'
import { vueCompiler } from './vue'
import { vanillaCompiler } from './vanilla'
import { svelteCompiler } from './svelte'

export const compilers: Record<Compiler, (context: NewContext) => Promise<CompileResult>> = {
  vue: vueCompiler,
  vanilla: vanillaCompiler,
  svelte: svelteCompiler,
}
