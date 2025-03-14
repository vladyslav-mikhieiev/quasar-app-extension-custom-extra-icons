/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 */

import fs from 'fs-extra'
import { convertIcons } from './converter/converter.js'

export default async function (api) {
  // Default configuration
  const defaultConfig = {
    sourceDir: 'src/assets/custom-extra-icons',
    outputPath: 'src/custom-extra-icons',
    iconPrefix: 'app',
    runInBeforeDev: true, // Default: run automatically in beforeDev hook
    stylesFilter: [
      { from: /fill:#000000;/g, to: 'fill:currentColor;' },
      { from: /fill:#000;/g, to: 'fill:currentColor;' },
      { from: /fill:black;/g, to: 'fill:currentColor;' },
    ],
  }

  // get settings from config file
  const configPath = api.resolve.app('custom-extra-icons.config.js')

  let config = { ...defaultConfig }

  if (fs.existsSync(configPath)) {
    try {
      const userConfig = await import(configPath)
      // Merge user config with default config, preserving user settings
      config = { ...defaultConfig, ...userConfig.default }
    } catch (error) {
      console.error('Error loading custom-extra-icons.config.js:', error)
    }
  } else {
    console.warn('custom-extra-icons.config.js not found, using defaults')
  }

  api.registerCommand('convert-icons', () => {
    console.log('Running custom-extra-icons converter...')
    try {
      return runIconConverter(api, config)
        .then((result) => {
          console.log('Icon conversion complete:')
          console.log(`- Icons processed: ${result.iconCount}`)
          console.log(`- Icons skipped: ${result.skippedCount}`)

          if (result.errors.length > 0) {
            console.log('- Errors encountered:')
            result.errors.forEach((err) => console.log(`  - ${err}`))
          }

          console.log(`Icons are available at: ${api.resolve.app(config.outputPath)}`)
          return result
        })
        .catch((error) => {
          console.error('Error converting icons:', error)
          process.exit(1)
        })
    } catch (error) {
      console.error('Error converting icons:', error)
      process.exit(1)
    }
  })

  // Register beforeDev hook to convert icons when dev server starts (if enabled)
  if (config.runInBeforeDev) {
    api.beforeDev(() => {
      console.log(' ')
      console.log('Running custom-extra-icons converter before dev server starts...')
      return runIconConverter(api, config)
    })
  }
}

/**
 * Run the icon converter with the Quasar API and config
 * @param {Object} api - Quasar API object
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} - Result of the conversion
 */
async function runIconConverter(api, config) {
  const sourceDir = api.resolve.app(config.sourceDir)
  const outputPath = api.resolve.app(config.outputPath)

  return convertIcons({
    sourceDir,
    outputPath,
    iconPrefix: config.iconPrefix,
    stylesFilter: config.stylesFilter,
    iconSetName: 'Custom SVG Icons',
  })
}
