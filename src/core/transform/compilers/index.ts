import type { CompileResult, Compiler, Context } from '../../../types'
import { vue3Compiler } from './vue3'
import { vue2Compiler } from './vue2'
import { vanillaCompiler } from './vanilla'
import { svelteCompiler } from './svelte'

export const compilers: Record<Compiler, (context: Context) => Promise<CompileResult>> = {
  vue3: vue3Compiler,
  vue2: vue2Compiler,
  vanilla: vanillaCompiler,
  svelte: svelteCompiler,
}
