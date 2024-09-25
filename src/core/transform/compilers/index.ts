import type { Compiler, CompileResult, Context } from '../../../types'
import { svelteCompiler } from './svelte'
import { vanillaCompiler } from './vanilla'
import { vue2Compiler } from './vue2'
import { vue3Compiler } from './vue3'

export const compilers: Record<Compiler, (context: Context) => Promise<CompileResult>> = {
  vue3: vue3Compiler,
  vue2: vue2Compiler,
  vanilla: vanillaCompiler,
  svelte: svelteCompiler,
}
