import { describe, expect, test, tier } from 'claude-code/testing'

import Views from '../../../hooks/views'

tier('builtin')

describe('language-of', () => {
  test('maps standard file extensions to language aliases', () => {
    expect(Views.languageOf('src/index.ts')).toBe('typescript')
    expect(Views.languageOf('src/app.tsx')).toBe('tsx')
    expect(Views.languageOf('scripts/main.js')).toBe('javascript')
    expect(Views.languageOf('components/app.jsx')).toBe('jsx')
    expect(Views.languageOf('server/app.py')).toBe('python')
    expect(Views.languageOf('src/main.rs')).toBe('rust')
    expect(Views.languageOf('cmd/main.go')).toBe('go')
    expect(Views.languageOf('styles/theme.css')).toBe('css')
    expect(Views.languageOf('data/config.json')).toBe('json')
    expect(Views.languageOf('deploy/helm.yaml')).toBe('yaml')
    expect(Views.languageOf('config.toml')).toBe('toml')
    expect(Views.languageOf('docs/readme.md')).toBe('markdown')
    expect(Views.languageOf('setup.sh')).toBe('shell')
    expect(Views.languageOf('install.ps1')).toBe('powershell')
    expect(Views.languageOf('query.sql')).toBe('sql')
  })

  test('handles Windows backslashes in paths', () => {
    expect(Views.languageOf('src\\models\\user.py')).toBe('python')
    expect(Views.languageOf('C:\\project\\src\\App.tsx')).toBe('tsx')
  })

  test('resolves compound extensions like .d.ts', () => {
    expect(Views.languageOf('types/claude-code.d.ts')).toBe('typescript')
  })

  test('resolves exact canonical filenames without extension', () => {
    expect(Views.languageOf('Dockerfile')).toBe('dockerfile')
    expect(Views.languageOf('dockerfile')).toBe('dockerfile')
    expect(Views.languageOf('Makefile')).toBe('makefile')
    expect(Views.languageOf('Gemfile')).toBe('ruby')
    expect(Views.languageOf('Rakefile')).toBe('ruby')
    expect(Views.languageOf('CMakeLists.txt')).toBe('cmake')
    expect(Views.languageOf('.bashrc')).toBe('shell')
    expect(Views.languageOf('.zshrc')).toBe('shell')
    expect(Views.languageOf('.gitignore')).toBe('ignore')
  })

  test('detects language from hunk shebang when extension is absent', () => {
    const pythonHunk = [
      '@@ -0,0 +1,4 @@',
      '+#!/usr/bin/env python3',
      '+import os',
      '+print("hi")',
    ].join('\n')

    expect(Views.languageOf('bin/my-script', pythonHunk)).toBe('python')

    const nodeHunk = [
      '@@ -0,0 +1,3 @@',
      '+#!/usr/bin/env node',
      '+console.log("hello")',
    ].join('\n')

    expect(Views.languageOf('bin/cli-tool', nodeHunk)).toBe('javascript')

    const bashHunk = [
      '@@ -0,0 +1,2 @@',
      '+#!/bin/bash',
      '+echo "run"',
    ].join('\n')

    expect(Views.languageOf('scripts/runner', bashHunk)).toBe('shell')
  })

  test('returns undefined for unknown extensions or empty paths', () => {
    expect(Views.languageOf('')).toBeUndefined()
    expect(Views.languageOf('some/file.xyzunknown99')).toBeUndefined()
    expect(Views.languageOf('file-without-extension')).toBeUndefined()
  })
})
