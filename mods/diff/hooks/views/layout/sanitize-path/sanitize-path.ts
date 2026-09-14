import { sanitizeLine } from '../sanitize-line'

/**
 * A path made safe to draw and to resolve syntax language for:
 * - Drops control, format, and default-ignorable characters via sanitizeLine.
 * - Converts Windows backslashes (`\`) to POSIX slashes (`/`).
 * - For git rename descriptions (`a -> b` or `path/{old => new}/file`),
 *   resolves to the target destination path.
 *
 * @param text the raw file path
 * @returns the sanitized, normalized POSIX-style path
 */
export function sanitizePath(text: string): string {
  const sanitized = sanitizeLine(text).trim()

  // Resolve git rename arrows if present: "old/path -> new/path"
  let target = sanitized
  if (target.includes(' -> ')) {
    const parts = target.split(' -> ')
    target = parts[parts.length - 1]?.trim() ?? target
  }

  // Resolve git diff-stat rename braces: "prefix/{old => new}/suffix"
  if (target.includes(' => ')) {
    target = target.replace(/\{[^}]*=>\s*([^}]+)\}/g, '$1')
  }

  // Normalize backslashes to forward slashes
  return target.replaceAll('\\', '/').replace(/\/+/g, '/')
}
