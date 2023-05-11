import { describe, expect, it } from 'vitest'
import { transformCode } from '../src/transform'

const code = 'console.log(foo,bar)'

const path = '/path/to/main.js'

describe('should', () => {
  it('exported', () => {
    expect(transformCode(code, path)).toEqual('console.log(\'🚀 ~ file: main.js ~ foo:\', foo)')
  })
})
