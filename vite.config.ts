import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  pack: {
    entry: ['src/*.ts'],
    dts: true,
    format: ['esm', 'cjs'],
    clean: true,
    outputOptions: {
      exports: 'named',
    },
    onSuccess: 'vp run build:client',
  },
  lint: {
    plugins: ['unicorn', 'typescript', 'oxc', 'vue', 'vitest'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
      perf: 'warn',
    },
    rules: {
      'no-console': 'off',
      'no-await-in-loop': 'off',
      'unicorn/no-array-sort': 'off',
      'no-restricted-globals': 'error',
      'typescript/consistent-type-imports': 'error',
      'prefer-add-event-listener': 'off',
    },
    ignorePatterns: [
      '.output/**',
      '.data/**',
      '.nuxt/**',
      '.nitro/**',
      '.cache/**',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    quoteProps: 'consistent',
  },
})
