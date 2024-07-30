import fs from 'node:fs/promises'
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        custom: {
          rspack: () => fs.readFile('./public/icons/rspack.svg', 'utf-8'),
          farm: () => fs.readFile('./public/icons/farm.svg', 'utf-8'),
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
