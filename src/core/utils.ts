import { createFilter } from '@rollup/pluginutils'

export const filter = createFilter(
  [/\.vue$/, /\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/, /\.svelte$/],
  [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/, /[\\/]\.vercel[\\/]/],
)

export function getConsoleStyle(fileType: string): string {
  const commonStyle = 'padding:4px; border-radius:5px; font-weight:600; '

  const consoleStyles: Record<string, string> = {
    '.js': `${commonStyle}color: #111827; background: #F7DF1E`,
    '.jsx': `${commonStyle}color: #111827; background: #F7DF1E`,
    '.ts': `${commonStyle}color: #fff; background: #3178C6`,
    '.tsx': `${commonStyle}color: #fff; background: #3178C6`,
    '.vue': `${commonStyle}color: #fff; background: #4FC08D`,
    '.svelte': `${commonStyle}color: #fff; background: #FF3E00`,
    '.astro': `${commonStyle}color: #fff; background: #FF5D01`,
    'default': `${commonStyle}color: #111827; background: #F7DF1E`,
  }

  return consoleStyles[fileType] ?? consoleStyles.default
}
