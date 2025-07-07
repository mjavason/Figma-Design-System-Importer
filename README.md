# Figma Design Variable Importer

This plugin streamlines your design workflow by automatically importing design system variables—including colors, typography, and spacing—directly into your Figma files. It eliminates the need for manual entry, reduces errors, and ensures consistency across your designs.
![Design System](https://raw.githubusercontent.com/mjavason/Figma-Design-System-Importer/main/public/eesign-system-screenshot.png)

## Features

- **Automated Variable Imports:** Quickly creates local variables for colors, typography (font sizes and weights), and spacing.
- **Dynamic Color Shades:** Automatically generates a full spectrum of shades for your base colors, saving you time and effort.
- **Visual Preview:** Generates a comprehensive design system page with color swatches and text styles, all linked to the imported variables for easy verification.
- **Customizable Configuration:** Easily tailor the design system to your needs by modifying a simple configuration file.

## How to Use

### 1. Configure Your Design System

Before running the plugin, you'll need to define your design system's properties in the `code.js` file. Open this file and modify the following sections:

- **`baseColors`:** Define your primary brand colors. The plugin will automatically generate a range of shades for each.
- **`typography`:** Set your desired font family, styles (weights), and sizes.
- **`spacing`:** Specify your spacing values.

### 2. Install the Plugin in Figma

1.  **Open the Figma Desktop App:** This plugin requires the desktop version of Figma.
2.  **Go to Plugins:** In the top menu, navigate to `Plugins` > `Development` > `Import plugin from manifest...`.
3.  **Select the `manifest.json` file:** Locate the plugin's directory and select the `manifest.json` file.

### 3. Run the Plugin

1.  **Open a Figma File:** Create a new file or open an existing one.
2.  **Run the Plugin:** Go to `Plugins` > `Development` > `Figma Design Variable Importer`.

The plugin will then:

- Create a new page named "Design System".
- Clear any existing local variables.
- Generate and import all your configured design system variables.
- Create a visual preview of the imported colors and typography.

## What Gets Created

- **A "Design System" Page:** A dedicated page that houses all the visual elements of your design system.
- **Variable Collections:** Neatly organized collections for `Colors`, `Typography`, and `Spacing` in the "Local Variables" panel.
- **Visual Previews:**
  - **Colors:** A section with all your color variables displayed as swatches.
  - **Typography:** A section that showcases your font styles and sizes.

This visual representation allows you to instantly verify that your design system has been imported correctly and is ready to use.
