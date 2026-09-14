const EXACT_FILENAMES: Readonly<Record<string, string>> = {
  dockerfile: 'dockerfile',
  containerfile: 'dockerfile',
  makefile: 'makefile',
  gnumakefile: 'makefile',
  gemfile: 'ruby',
  rakefile: 'ruby',
  vagrantfile: 'ruby',
  jenkinsfile: 'groovy',
  'cmakelists.txt': 'cmake',
  '.bashrc': 'shell',
  '.bash_profile': 'shell',
  '.zshrc': 'shell',
  '.profile': 'shell',
  '.gitignore': 'ignore',
  '.gitattributes': 'ignore',
  '.dockerignore': 'ignore',
  '.npmignore': 'ignore',
}

const EXTENSIONS: Readonly<Record<string, string>> = {
  // TypeScript & JavaScript
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'jsx',

  // Python
  py: 'python',
  pyw: 'python',
  pyi: 'python',

  // Systems languages
  rs: 'rust',
  go: 'go',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  hh: 'cpp',
  cs: 'csharp',

  // JVM & Mobile
  java: 'java',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  dart: 'dart',

  // Scripting & Web
  rb: 'ruby',
  php: 'php',
  lua: 'lua',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'css',
  sass: 'css',
  less: 'css',

  // Data & Config formats
  json: 'json',
  jsonc: 'json',
  json5: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  xml: 'xml',
  svg: 'xml',
  sql: 'sql',
  graphql: 'graphql',
  gql: 'graphql',
  proto: 'protobuf',

  // Markdown & Documentation
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'markdown',

  // Shells
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  ps1: 'powershell',
  psm1: 'powershell',
  psd1: 'powershell',

  // Other languages
  zig: 'zig',
  gd: 'gdscript',
}

const SHEBANG_COMMANDS: Readonly<Record<string, string>> = {
  node: 'javascript',
  deno: 'typescript',
  bun: 'typescript',
  python: 'python',
  python3: 'python',
  bash: 'shell',
  sh: 'shell',
  zsh: 'shell',
  ruby: 'ruby',
  perl: 'perl',
  php: 'php',
}

/**
 * Resolves the syntax highlighting language alias for a given file path and
 * optional hunk sample source:
 * 1. Exact canonical filename (e.g. `Dockerfile` -> `'dockerfile'`).
 * 2. Extension matching, including compound extensions (`.d.ts` -> `'typescript'`).
 * 3. Shebang detection from sample hunk content when extension is absent or unrecognized.
 *
 * @param path the sanitized file path
 * @param sampleSource optional diff hunk source to detect shebangs
 * @returns canonical language string, or undefined for engine fallback
 */
export function languageOf(
  path: string,
  sampleSource?: string,
): string | undefined {
  if (!path) {
    return undefined
  }

  // Extract basename
  const normalized = path.replaceAll('\\', '/')
  const lastSlash = normalized.lastIndexOf('/')
  const basename = (lastSlash >= 0 ? normalized.slice(lastSlash + 1) : normalized).toLowerCase()

  if (!basename) {
    return undefined
  }

  // 1. Exact filename check
  const exact = EXACT_FILENAMES[basename]
  if (exact !== undefined) {
    return exact
  }

  // 2. Compound extension check (e.g. .d.ts)
  if (basename.endsWith('.d.ts')) {
    return 'typescript'
  }

  // Simple extension check
  const dotIndex = basename.lastIndexOf('.')
  if (dotIndex > 0 && dotIndex < basename.length - 1) {
    const ext = basename.slice(dotIndex + 1)
    const matched = EXTENSIONS[ext]
    if (matched !== undefined) {
      return matched
    }
  }

  // 3. Shebang inspection from sample source
  if (sampleSource) {
    const shebangMatch = sampleSource.match(
      /^[+ ]?#!\s*(?:\/usr\/bin\/env\s+|\/bin\/|\/usr\/bin\/)?([a-zA-Z0-9._-]+)/m,
    )
    if (shebangMatch?.[1]) {
      const command = shebangMatch[1].toLowerCase()
      const shebangLang = SHEBANG_COMMANDS[command]
      if (shebangLang !== undefined) {
        return shebangLang
      }
    }
  }

  return undefined
}
