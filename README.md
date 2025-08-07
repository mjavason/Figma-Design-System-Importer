# Figma Design System & Variable Importers

This repository contains two Figma plugins designed to streamline your design workflow by automatically importing design system variables—including colors, typography, and spacing—directly into your Figma files.

1.  **Design System Importer:** A comprehensive plugin that not only creates local variables but also generates a visual "Design System" page in Figma to preview your colors and typography.
2.  **Simple Variable Importer:** A lightweight plugin that focuses solely on creating and importing local variables without generating a visual preview page.

---

## 1. Design System Importer

This plugin is ideal for when you want a visual reference of your design system directly in your Figma file. It creates local variables and then builds a page with color swatches and text styles linked to those variables.

![Design System Preview](https://raw.githubusercontent.com/mjavason/Figma-Design-System-Importer/main/public/design-system-screenshot.png)

### Features

-   **Automated Variable Imports:** Quickly creates local variables for colors, typography (font sizes and weights), and spacing.
-   **Dynamic Color Shades:** Automatically generates a full spectrum of shades for your base colors.
-   **Visual Preview Page:** Generates a "Design System" page with color swatches and text styles for easy verification.

### How to Use

#### a. Configure Your Design System

Before running the plugin, define your design system properties in the `Design System/code.js` file. Modify the `config` object at the top of the file to set your brand colors, typography, and spacing values.

#### b. Install the Plugin in Figma

1.  In the Figma Desktop App, go to `Plugins` > `Development` > `Import plugin from manifest...`.
2.  Select the `manifest.json` file located in the **`Design System`** directory.

#### c. Run the Plugin

1.  Open any Figma file.
2.  Go to `Plugins` > `Development` > `Figma Design Variable Importer`.
3.  The plugin will create a new page named "Design System" and populate it with your variables and visual styles.

---

## 2. Simple Variable Importer

This plugin is a stripped-down version for users who only need to create and import local variables without the visual preview. It's faster and keeps your Figma file clean.

![Variables Screenshot](https://raw.githubusercontent.com/mjavason/Figma-Design-System-Importer/main/public/variables-screenshot.png)

### Features

-   **Fast Variable Imports:** Quickly creates local variables for colors, typography, and spacing.
-   **Dynamic Color Shades:** Automatically generates shades for your base colors.
-   **Lightweight:** No extra pages or visual elements are created.

### How to Use

#### a. Configure Your Design System

Before running the plugin, define your design system properties in the `Variable Import/code.js` file. Modify the configuration variables at the top of the file (`baseColors`, `fontFamily`, `fontSizes`, etc.).

#### b. Install the Plugin in Figma

1.  In the Figma Desktop App, go to `Plugins` > `Development` > `Import plugin from manifest...`.
2.  Select the `manifest.json` file located in the **`Variable Import`** directory.

#### c. Run the Plugin

1.  Open any Figma file.
2.  Go to `Plugins` > `Development` > `Simple Variable Importer`.
3.  The plugin will clear any existing local variables and generate new ones based on your configuration.