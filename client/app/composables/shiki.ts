import js from '@shikijs/langs/javascript'
import VitesseDark from '@shikijs/themes/vitesse-dark'
import VitesseLight from '@shikijs/themes/vitesse-light'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export const shiki = createHighlighterCoreSync({
  themes: [
    VitesseLight,
    VitesseDark,
  ],
  langs: [js],
  engine: createJavaScriptRegexEngine(),
})
