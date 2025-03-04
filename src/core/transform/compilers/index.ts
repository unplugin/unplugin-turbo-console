import type { Compiler, CompileResult, Context } from '../../../types'
import { sfcCompiler } from './sfc'
import { vanillaCompiler } from './vanilla'

export const compilers: Record<Compiler, (context: Context) => Promise<CompileResult>> = {
  vue: sfcCompiler,
  vanilla: vanillaCompiler,
  svelte: sfcCompiler,
}
