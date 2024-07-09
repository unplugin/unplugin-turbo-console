import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/*.ts',
  ],
  clean: false,
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  onSuccess: 'npm run build:fix',
  shims: true,
})
