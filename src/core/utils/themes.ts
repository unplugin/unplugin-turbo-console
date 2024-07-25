export type FileExt = 'js' | 'jsx' | 'ts' | 'tsx' | 'vue' | 'svelte' | 'astro'

interface HighlightTheme {
  'padding'?: string
  'color'?: string
  'background'?: string
  'border-radius'?: string
  'margin'?: string
}

interface Themes {
  highlight: {
    [key in FileExt]?: HighlightTheme
  } & {
    icon?: string
  }
  launchEditor: {
    'icon'?: string
    'padding'?: string
    'border-radius'?: string
    'margin'?: string
    'background'?: string
  }
}

const commonStyle = {
  'padding': '2px 5px',
  'border-radius': '3px 0 0 3px',
  'margin': '0 0 5px 0',
}

export const builtInThemes: Themes = {
  highlight: {
    icon: '🚀',
    js: {
      ...commonStyle,
      color: '#fff',
      background: '#4FC08D',
    },
    jsx: {
      ...commonStyle,
      color: '#fff',
      background: '#4FC08D',
    },
    ts: {
      ...commonStyle,
      color: '#fff',
      background: '#3178C6',
    },
    tsx: {
      ...commonStyle,
      color: '#fff',
      background: '#3178C6',
    },
    svelte: {
      ...commonStyle,
      color: '#fff',
      background: '#FF3E00',
    },
    astro: {
      ...commonStyle,
      color: '#fff',
      background: '#FF5D01',
    },
    vue: {
      ...commonStyle,
      color: '#fff',
      background: '#4FC08D',
    },
  },
  launchEditor: {
    'icon': '🔦',
    'background': '#00DC8250',
    'padding': '2px 5px',
    'border-radius': '0 3px 3px 0',
    'margin': '0 0 5px 0',
  },
}

export function getStyleCode(fileType: FileExt) {
  const theme = builtInThemes.highlight[fileType]!

  const highlight = Object.entries(theme).map(([key, value]) => {
    return `${key}:${value};`
  }).join('')

  const launchEditor = Object.entries(builtInThemes.launchEditor).map(([key, value]) => {
    if (key !== 'icon')
      return `${key}:${value};`
    return ''
  }).join('')

  return {
    launchEditor,
    highlight,
  }
}
