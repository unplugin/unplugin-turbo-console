import { execSync } from 'node:child_process'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  dts: true,
  format: ['esm', 'cjs'],
  clean: true,
  outputOptions: {
    exports: 'named',
  },
  onSuccess: () => {
    execSync('pnpm build:client', { stdio: 'inherit' })
  },
})
