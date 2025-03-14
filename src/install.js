/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 */

import fs from 'fs-extra'

export default function (api) {
  // Create config file if it doesn't exist
  const configPath = api.resolve.app('custom-extra-icons.config.js')

  if (!fs.existsSync(configPath)) {
    const configContent = `export default {
      // Directory with SVG icons (relative to project root)
      sourceDir: 'src/assets/custom-extra-icons',

      // Output file path for converted icons
      outputPath: 'src/custom-extra-icons',

      // Icon prefix
      iconPrefix: 'app',

      // Auto run in beforeDev hook
      runInBeforeDev: true,

      // Filters for SVG styles
      // Can be:
      // 1. Function: (styles) => modifiedStyles
      // 2. Array of objects: [{ from: /regex/, to: 'replacement' }]
      stylesFilter: [
        // Default filters convert black fills to currentColor
        { from: /fill:#000000;/g, to: 'fill:currentColor;' },
        { from: /fill:#000;/g, to: 'fill:currentColor;' },
        { from: /fill:black;/g, to: 'fill:currentColor;' }
      ],
    }
`
    fs.writeFileSync(configPath, configContent, 'utf8')

    console.log('Created custom-extra-icons.config.js in your project root')
  }
}
