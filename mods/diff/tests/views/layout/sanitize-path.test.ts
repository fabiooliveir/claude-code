import { describe, expect, test, tier } from 'claude-code/testing'

import Views from '../../../hooks/views'

tier('builtin')

describe('sanitize-path', () => {
  test('converts Windows backslashes to forward slashes', () => {
    expect(Views.sanitizePath('src\\components\\Button.tsx')).toBe(
      'src/components/Button.tsx',
    )
    expect(Views.sanitizePath('C:\\Users\\dev\\project\\file.ts')).toBe(
      'C:/Users/dev/project/file.ts',
    )
  })

  test('resolves git rename arrows to the target destination', () => {
    expect(Views.sanitizePath('src/old.ts -> src/new.ts')).toBe('src/new.ts')
    expect(Views.sanitizePath('a/b/c.py -> d/e/f.py')).toBe('d/e/f.py')
  })

  test('resolves git diff-stat rename braces to the target path', () => {
    expect(Views.sanitizePath('src/{old => new}/index.ts')).toBe(
      'src/new/index.ts',
    )
    expect(Views.sanitizePath('{prev => curr}/config.json')).toBe(
      'curr/config.json',
    )
  })

  test('drops control and default-ignorable characters', () => {
    expect(Views.sanitizePath('\tsrc/app/\u200Bfile.ts\r')).toBe(
      'src/app/file.ts',
    )
  })

  test('collapses multiple consecutive slashes', () => {
    expect(Views.sanitizePath('src///utils////helper.ts')).toBe(
      'src/utils/helper.ts',
    )
  })
})
