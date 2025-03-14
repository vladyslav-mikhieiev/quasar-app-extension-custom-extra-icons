/**
 * Script for converting SVG icons to Quasar Framework compatible format
 *
 * Usage: node convert-icons.js [path to SVG icons] [icon prefix]
 * Example: node convert-icons.js ./svg-icons my
 */

// Configuration settings
import minimist from 'minimist'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { convertIcons } from './converter.js'

// Export the converter function
export { convertIcons } from './converter.js'

// When this file is run directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = minimist(process.argv.slice(2))

  const distName = args.dist || 'dist' // output directory (default is 'dist')
  const iconSetName = args.name || 'Custom SVG Icons' // icon set name
  const prefix = args._[1] || 'custom' // prefix for icon names (second argument)
  const iconPath = args._[0] || './svg-icons' // path to your SVG icons (first argument)

  // Get the directory name of the current module
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const start = new Date()

  // Path to your SVG files
  const svgFolder = path.resolve(__dirname, iconPath)
  const distFolder = path.resolve(__dirname, `${distName}`)

  // Run the converter
  convertIcons({
    sourceDir: svgFolder,
    outputPath: distFolder,
    iconPrefix: prefix,
    iconSetName,
  })
    .then((result) => {
      const end = new Date()

      if (result.success) {
        console.log(`
      ✅ CLI conversion completed in ${end - start}ms
      `)
      } else {
        console.error(`
      ❌ CLI conversion failed
      `)
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}
