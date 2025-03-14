# Quasar App Extension custom-extra-icons

A Quasar Framework extension that allows you to convert SVG icons into a [Quasar-compatible format](https://quasar.dev/vue-components/icon#svg-icon-format) and use them in your application.

## Features

- Convert SVG icons to Quasar-compatible format
- Custom icon prefixing
- Style transformation through flexible filters
- Automatic conversion during development
- Simple integration with Quasar applications
- Control over icon size and color as defined in [Quasar documentation](https://quasar.dev/vue-components/icon#size-and-colors)

## Inspiration & Acknowledgements

This extension was inspired by the excellent [quasar-extras-svg-icons](https://github.com/hawkeye64/quasar-extras-svg-icons) project. We studied their approach to SVG conversion and icon management within the Quasar ecosystem to build this extension. If you're looking for a pre-built collection of SVG icons already converted to Quasar format, their package is highly recommended.

## Installation

```bash
quasar ext add custom-extra-icons
```

Quasar CLI will download the extension from the NPM registry and install it in your project.

## Configuration

After installing the extension, a configuration file `custom-extra-icons.config.js` will be created in the root directory of your project:

```js
export default {
  // Directory with SVG icons (relative to project root)
  sourceDir: 'src/assets/custom-extra-icons',

  // Output file path for converted icons
  outputPath: 'src/custom-extra-icons',

  // Icon prefix
  iconPrefix: 'app',

  // Run automatically in beforeDev hook
  runInBeforeDev: true,

  // Filters for SVG styles
  // Can be:
  // 1. Function: (styles) => modifiedStyles
  // 2. Array of objects: [{ from: /regex/ or 'string', to: 'replacement' }]
  stylesFilter: [
    // Default filters convert black fills to currentColor
    { from: /fill:#000000;/g, to: 'fill:currentColor;' },
    { from: /fill:#000;/g, to: 'fill:currentColor;' },
    { from: /fill:black;/g, to: 'fill:currentColor;' },
  ],
}
```

### Configuration Options

| Option           | Type           | Default                         | Description                                                            |
| ---------------- | -------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `sourceDir`      | String         | 'src/assets/custom-extra-icons' | Path to the directory with source SVG icons (relative to project root) |
| `outputPath`     | String         | 'src/custom-extra-icons'        | Path to save converted icons                                           |
| `iconPrefix`     | String         | 'app'                           | Prefix for icon names                                                  |
| `runInBeforeDev` | Boolean        | true                            | Whether to automatically run icon conversion during development        |
| `stylesFilter`   | Array/Function | See above                       | Filters for SVG styles                                                 |

### stylesFilter

The `stylesFilter` option allows you to customize the transformation of SVG icon styles before conversion. It can be:

1. **An array of objects** with `from` and `to` fields, where:

   - `from`: can be a string or regular expression
   - `to`: replacement string

   Examples:

   Using plain strings (default):

   ```js
   stylesFilter: [
     { from: 'fill:#000000', to: 'fill:currentColor' },
     { from: 'fill:red', to: 'fill:blue' },
   ]
   ```

   Using regular expressions with global flag (`/g`):

   ```js
   stylesFilter: [{ from: /fill:#FF0000;/g, to: 'fill:currentColor;' }]
   ```

   Using regular expressions without global flag:

   ```js
   stylesFilter: [{ from: /fill:#FF0000;/, to: 'fill:currentColor;' }]
   ```

   The difference between regex options:

   - With `/g` flag: **All occurrences** of the pattern in a style string will be replaced
   - Without `/g` flag: Only the **first occurrence** of the pattern will be replaced
   - With string values: Simple string replacement (without regex capabilities)

2. **A function** that takes a style string and returns a modified string:
   ```js
   stylesFilter: (styles) => styles.replace(/stroke-width:2;/g, 'stroke-width:1.5;')
   ```

By default, `stylesFilter` converts black fills to `currentColor`, which allows you to use the text color as the icon color.

## Usage

### Automatic Conversion

By default, the extension will automatically convert your SVG icons when you start the development server with `quasar dev`. This behavior is controlled by the `runInBeforeDev` configuration option.

### Manual Conversion

You can also manually trigger the icon conversion process using the Quasar CLI:

```bash
quasar run custom-extra-icons convert-icons
```

This is useful when you:

- Have disabled automatic conversion (`runInBeforeDev: false`)
- Want to update icons without restarting the development server
- Need to troubleshoot icon conversion issues

### Creating SVG Icons

1. Create a directory for SVG icons (default is `src/assets/custom-extra-icons`).
2. Add SVG files to this directory.

### Using in Quasar Components

#### Option 1: Using Options API

```js
<template>
  <q-icon :name="appIconName" />
</template>

<script>
import { appIconName } from 'src/custom-extra-icons'

export default {
  setup() {
    return {
      appIconName,
    }
  },
}
</script>
```

#### Option 2: Using Composition API with script setup

```js
<template>
  <q-icon :name="appIconName" />
</template>

<script setup>
import { appIconName } from 'src/custom-extra-icons'
</script>
```

### Controlling Size and Colors

Once converted, your icons work just like any other Quasar icon, which means you can control:

- Size: Using CSS or the `size` prop (`xs`, `sm`, `md`, `lg`, `xl`, or specific pixel values)
- Color: Using color classes or the `color` prop

Example:

```vue
<template>
  <!-- Using props -->
  <q-icon :name="appIconName" size="2rem" color="primary" />

  <!-- Using classes -->
  <q-icon :name="appIconName" class="text-2xl text-secondary" />
</template>
```

For more information on controlling icon size and colors, see the [Quasar Icon documentation](https://quasar.dev/vue-components/icon#size-and-colors).

## Conversion Limitations

Not all SVG icons can be successfully converted to the Quasar format. Some limitations include:

- SVGs using advanced features like `<use>`, `<mask>`, `<clipPath>`, etc.
- SVGs with `<linearGradient>` or `<radialGradient>` elements
- SVGs with embedded CSS or complex style attributes
- SVGs with animations or scripts

These limitations were also documented in the [quasar-extras-svg-icons](https://github.com/hawkeye64/quasar-extras-svg-icons) repository, which provided valuable insights into the challenges of SVG conversion for Quasar.

## Troubleshooting

### Common Issues

- **Icons Not Found**: Make sure your SVG files are in the correct directory (`sourceDir` in the config)
- **Conversion Errors**: Check that your SVG files are valid and don't contain unsupported features
- **Icons Not Showing**: Verify that you're importing the icons correctly and using the proper name format

### Debug Tips

If you're having trouble with icon conversion, you can check:

1. The console output during development for conversion errors
2. The generated files in your `outputPath` directory
3. The SVG source files for any non-standard elements or attributes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Uninstallation

```bash
quasar ext remove custom-extra-icons
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
