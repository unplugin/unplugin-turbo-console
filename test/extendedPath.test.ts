import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { getExtendedPath } from '../src/core/utils'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
  }
})

describe('empty extendedPathFileName option test', () => {
  it('test 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/index.vue', []),
    ).toBe('index.vue')
  })

  it('test 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/main.vue', []),
    ).toBe('main.vue')
  })
})

describe('single extendedPathFileName option test', () => {
  it('filename (exact match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/index.vue', ['index']),
    ).toBe('Feature2/index.vue')
  })

  it('filename (partial match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/index.a.vue', ['index']),
    ).toBe('index.a.vue')
  })

  it('filename (partial match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex.vue', ['index']),
    ).toBe('aIndex.vue')
  })

  it('folder (exact match) & filename (exact match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/index.vue', ['index']),
    ).toBe('Feature2/Index/index.vue')
  })

  it('folder (exact match) & filename (partial match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/aIndex.vue', ['index']),
    ).toBe('aIndex.vue')
  })

  it('folder (exact match) & filename (no match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/main.vue', ['index']),
    ).toBe('main.vue')
  })

  it('folder (partial match) & filename (exact match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex/index.vue', ['index']),
    ).toBe('aIndex/index.vue')
  })

  it('folder (partial match) & filename (partial match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex/bIndex.vue', ['index']),
    ).toBe('bIndex.vue')
  })

  it('folder (partial match) & filename (no match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex/bIndex.vue', ['index']),
    ).toBe('bIndex.vue')
  })

  it('folder (no match) & filename (no match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/main.vue', ['index']),
    ).toBe('main.vue')
  })

  it('parent folder (exact match) & filename (exact match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/index.vue', ['index']),
    ).toBe('xxyyzz/index.vue')
  })

  it('parent folder (exact match) & filename (partial match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/aIndex.vue', ['index']),
    ).toBe('aIndex.vue')
  })

  it('parent folder (exact match) & filename (no match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/main.vue', ['index']),
    ).toBe('main.vue')
  })
})

describe('multiple extendedPathFileName options test', () => {
  it('filename (exact match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/index.vue', ['index', 'main']),
    ).toBe('Feature2/index.vue')
  })

  it('filename (exact match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/main.vue', ['index', 'main']),
    ).toBe('Feature2/main.vue')
  })

  it('filename (partial match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/index.main.vue', ['index', 'main']),
    ).toBe('index.main.vue')
  })

  it('filename (partial match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/mainIndex.vue', ['index', 'main']),
    ).toBe('mainIndex.vue')
  })

  it('folder (exact match) & filename (exact match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/index.vue', ['index', 'main']),
    ).toBe('Feature2/Index/index.vue')
  })

  it('folder (exact match) & filename (exact match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/index.vue', ['index', 'main']),
    ).toBe('Feature2/Main/index.vue')
  })

  it('folder (exact match) & filename (partial match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/aIndex.vue', ['index', 'main']),
    ).toBe('aIndex.vue')
  })

  it('folder (exact match) & filename (partial match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/aMain.vue', ['index', 'main']),
    ).toBe('aMain.vue')
  })

  it('folder (exact match) & filename (no match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('folder (exact match) & filename (no match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('folder (partial match) & filename (exact match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/indexmain/index.vue', ['index', 'main']),
    ).toBe('indexmain/index.vue')
  })

  it('folder (partial match) & filename (exact match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/indexmain/main.vue', ['index', 'main']),
    ).toBe('indexmain/main.vue')
  })

  it('folder (partial match) & filename (partial match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex/bMain.vue', ['index', 'main']),
    ).toBe('bMain.vue')
  })

  it('folder (partial match) & filename (partial match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aMain/bIndex.vue', ['index', 'main']),
    ).toBe('bIndex.vue')
  })

  it('folder (partial match) & filename (no match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aIndex/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('folder (partial match) & filename (no match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aMain/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('folder (no match) & filename (no match)', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('parent folder (exact match) & filename (exact match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/index.vue', ['index', 'main']),
    ).toBe('xxyyzz/index.vue')
  })

  it('parent folder (exact match) & filename (exact match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/xxyyzz/main.vue', ['index', 'main']),
    ).toBe('xxyyzz/main.vue')
  })

  it('parent folder (exact match) & filename (exact match) 3', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/main.vue', ['index', 'main']),
    ).toBe('xxyyzz/main.vue')
  })

  it('parent folder (exact match) & filename (partial match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/aIndex.vue', ['index', 'main']),
    ).toBe('aIndex.vue')
  })

  it('parent folder (exact match) & filename (partial match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/xxyyzz/aMain.vue', ['index', 'main']),
    ).toBe('aMain.vue')
  })

  it('parent folder (exact match) & filename (partial match) 3', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/xxyyzz/aIndex.vue', ['index', 'main']),
    ).toBe('aIndex.vue')
  })

  it('parent folder (exact match) & filename (no match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Index/xxyyzz/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('parent folder (exact match) & filename (no match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/xxyyzz/aaa.vue', ['index', 'main']),
    ).toBe('aaa.vue')
  })

  it('parent folder (exact match) & folder (exact match) & filename (exact match) 1', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/Index/index.vue', ['index', 'main']),
    ).toBe('Feature2/Main/Index/index.vue')
  })

  it('parent folder (exact match) & folder (exact match) & filename (exact match) 2', () => {
    expect(
      getExtendedPath('/unplugin-turbo-console/examples/vite-vue3/src/views/Feature2/Main/Index/main.vue', ['index', 'main']),
    ).toBe('Feature2/Main/Index/main.vue')
  })
})
