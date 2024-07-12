import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/*.ts',
  ],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  onSuccess: 'npm run build:fix',
})
