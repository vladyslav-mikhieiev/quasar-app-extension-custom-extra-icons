/**
 * SVG icon converter module
 *
 * This module provides a function to convert SVG icons to Quasar-compatible format
 */

import fs from 'fs-extra'
import path from 'path'
import * as tinyglobby from 'tinyglobby'
import { defaultNameMapper, extract, writeExports } from './utils/index.js'

/**
 * Convert SVG icons to Quasar-compatible format
 *
 * @param {Object} options - Conversion options
 * @param {string} options.sourceDir - Source directory with SVG icons
 * @param {string} options.outputPath - Output directory for converted icons
 * @param {string} options.iconPrefix - Prefix for icon names
 * @param {Array} [options.stylesFilter] - Custom style filters
 * @param {string} [options.iconSetName] - Name of the icon set
 * @returns {Promise<Object>} - Result of the conversion
 */
export async function convertIcons({
  sourceDir,
  outputPath,
  iconPrefix = 'app',
  stylesFilter = [
    { from: 'fill:#000000', to: 'fill:currentColor' },
    { from: 'fill:#000', to: 'fill:currentColor' },
    { from: 'fill:black', to: 'fill:currentColor' },
  ],
  iconSetName = 'Custom SVG Icons',
}) {
  // Result object
  const result = {
    success: false,
    iconCount: 0,
    skippedCount: 0,
    iconNames: [],
    errors: [],
  }

  if (!fs.existsSync(sourceDir)) {
    const error = `Source directory ${sourceDir} does not exist`
    console.warn(error)
    result.errors.push(error)
    return result
  }

  console.log(`Converting icons from ${sourceDir} to ${outputPath}`)

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // Find all SVG files in the source directory
  const svgFiles = tinyglobby.globSync(path.join(sourceDir, '/*.svg'))

  if (svgFiles.length === 0) {
    const error = `No SVG files found in ${sourceDir}`
    console.warn(error)
    result.errors.push(error)
    return result
  }

  console.log(`Found ${svgFiles.length} SVG files to convert`)

  const iconNames = new Set()
  const svgExports = []
  const typeExports = []
  const skipped = []

  // Process each SVG file
  svgFiles.forEach((file) => {
    const name = defaultNameMapper(file, iconPrefix)

    if (iconNames.has(name)) {
      const warning = `Warning: duplicate icon name '${name}'. File '${file}' will be skipped.`
      console.warn(warning)
      skipped.push(name)
      return
    }

    try {
      // Use extract to convert SVG to the required format
      const { svgDef, typeDef } = extract(file, name, { stylesFilter })
      svgExports.push(svgDef)
      typeExports.push(typeDef)

      iconNames.add(name)
    } catch (err) {
      const error = `[Error] "${name}" could not be processed: ${err.message}`
      console.error(error)
      result.errors.push(error)
      skipped.push(name)
    }
  })

  if (iconNames.size === 0) {
    const error = `Error: No icons were processed successfully.`
    console.error(error)
    result.errors.push(error)
    return result
  }

  try {
    // Write the exports to files
    await writeExports(iconSetName, outputPath, svgExports, typeExports, skipped)

    // Write the JSON file with icon names
    const file = path.resolve(outputPath, 'icons.json')
    fs.writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf-8')

    console.log(`
    ✅ Conversion completed successfully!
       ${iconSetName} (count: ${iconNames.size})
       Icons saved to: ${outputPath}
    `)

    if (skipped.length > 0) {
      console.log(`⚠️  Skipped icons: ${skipped.length}`)
    }

    console.log(`
    📝 Using icons in Quasar:

    1. Import from index.js:

       import { ${[...iconNames].slice(0, 2).join(', ')}${
         iconNames.size > 2 ? ', ...' : ''
       } } from '${outputPath}';

    2. Use in components:

       <q-icon :name="${[...iconNames][0]}" />
    `)

    // Update result object
    result.success = true
    result.iconCount = iconNames.size
    result.skippedCount = skipped.length
    result.iconNames = [...iconNames]

    return result
  } catch (error) {
    console.error('Error writing exports:', error)
    result.errors.push(`Error writing exports: ${error.message}`)
    return result
  }
}
