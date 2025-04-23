import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
  outputOptions: {
    exports: 'named',
  },
  onSuccess: 'pnpm build:client',
})
