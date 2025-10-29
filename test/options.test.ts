import { join } from 'pathe'
import { describe, expect, it, vi } from 'vitest'
import { resolveOptions } from '../src/core/options/resolve'
import { transform } from '../src/core/transform'
import globalStore from '../src/core/utils/globalStore'
import { DISABLE_ALL, DISABLE_HIGHLIGHT, DISABLE_LAUNCH_EDITOR, EMPTY, EXTENDED_PATH, WITH_PREFIX } from './fixtures/option'

vi.mock('node:process', () => {
  return {
    cwd: vi.fn(() => join('/', 'mock', 'path')),
    env: {
      NODE_ENV: 'development',
    },
  }
})

const mockFilePathMap = new Map()
mockFilePathMap.set('../../home/runner/main.js', 'fgsss')
mockFilePathMap.set('../../home/runner/index.js', 'sfgha')

globalStore.set('port', 3070)
globalStore.set('filePathMap', mockFilePathMap)

describe('transform options', () => {
  it('empty option', async () => {
    EMPTY.options = resolveOptions(EMPTY.options)

    expect(
      await transform(
        EMPTY,
      ),
    ).toMatchSnapshot()
  })

  it('with prefix suffix', async () => {
    WITH_PREFIX.options = resolveOptions(WITH_PREFIX.options)
    expect(
      await transform(
        WITH_PREFIX,
      ),
    ).toMatchSnapshot()
  })

  it('disable launch editor', async () => {
    DISABLE_LAUNCH_EDITOR.options = resolveOptions(DISABLE_LAUNCH_EDITOR.options)
    expect(
      await transform(
        DISABLE_LAUNCH_EDITOR,
      ),
    ).toMatchSnapshot()
  })

  it('disable highlight', async () => {
    DISABLE_HIGHLIGHT.options = resolveOptions(DISABLE_HIGHLIGHT.options)
    expect(
      await transform(
        DISABLE_HIGHLIGHT,
      ),
    ).toMatchSnapshot()
  })

  it('disable all', async () => {
    DISABLE_ALL.options = resolveOptions(DISABLE_ALL.options)
    expect(
      await transform(
        DISABLE_ALL,
      ),
    ).toMatchSnapshot()
  })

  it('extended path option', async () => {
    EXTENDED_PATH.options = resolveOptions(EXTENDED_PATH.options)
    expect(
      await transform(
        EXTENDED_PATH,
      ),
    ).toMatchSnapshot()
  })
})

describe('resolve options', () => {
  it('empty', () => {
    expect(resolveOptions({})).toMatchInlineSnapshot(`
      {
        "highlight": true,
        "inspector": {
          "printUrl": true,
        },
        "launchEditor": true,
        "passLogs": true,
        "prefix": "",
        "server": {
          "host": "127.0.0.1",
          "port": 3070,
        },
        "suffix": "",
      }
    `)
  })
})
