# Figma Design System Importer

This is a simple Figma plugin designed to help you quickly import design system variables (like colors, typography, and spacing) directly into your Figma file. This saves you from manually adding each variable and helps prevent typos, making your design process smoother and more consistent.

## Features

- **Imports Color Variables:** Automatically creates local color variables in your Figma file.
- **Imports Typography Variables:** Sets up local variables for font sizes and weights.
- **Imports Spacing Variables:** Defines local variables for consistent spacing values.
- **Generates Variable Preview:** Creates a visual preview frame showing color swatches with variable bindings for easy verification.

## How to Set Up and Use (No Programming Needed!)

Follow these steps to get the plugin running in Figma:

### Step 1: Get the Plugin Files

1.  **Download the Plugin:** If you haven't already, download the entire plugin folder to your computer.

2.  **Add your desired variables** Open the `code.js` file. Look for the `colors`, `typography`, and `spacing` objects to change the values to match your design system. It should look familiar... Make all your changes then save.

### Step 2: Prepare Figma

1.  **Open Figma Desktop App:** Make sure you are using the Figma desktop application, not the web version. This is important for installing local plugins.
2.  **Go to Plugins:** In Figma, click on `Plugins` in the top menu bar.
3.  **Develop Plugins:** Hover over `Plugins` and then click on `Development`.
4.  **Import Plugin from Manifest...:** Select `Import Plugin from Manifest...`.

### Step 3: Import the Plugin

1.  **Navigate to the Plugin Folder:** A file browser window will open. Navigate to the folder that you downloaded in Step 1.
2.  **Select `manifest.json`:** Inside the `Design System Importer` folder, select the file named `manifest.json` and click `Open`.

    - **Success!** You should see a message saying the plugin was imported successfully.

### Step 4: Run the Plugin

1.  **Open a Figma File:** Open any Figma design file (or create a new one).
2.  **Run the Plugin:** Go back to `Plugins` in the top menu bar.
3.  **Development:** Hover over `Development`.
4.  **Select "Figma Design Variable Importer":** Click on `Figma Design Variable Importer` (this is the name of the plugin).

    - A small window will appear showing the plugin running. It will clear any existing local variables and styles, then import the new ones.

### Step 5: Check Your Variables and Preview

1.  **Variables Panel:** Once the plugin finishes (it will say "Done."), close the plugin window.
2.  **Access Variables:** In the right sidebar of Figma, look for the `Variables` section. You should now see new collections for "Color Variables", "Typography Variables", and "Spacing Variables" filled with the imported values!
3.  **Visual Preview:** The plugin creates a "🧱 Design System" page with a "Variable Preview" frame containing color swatches that are bound to your variables. This allows you to visually verify that your variables are working correctly and see how they look in practice.

## What Gets Created

When you run the plugin, it will:

- Create or switch to a "🧱 Design System" page
- Clear any existing local variables and styles
- Import your custom variables organized in collections
- Generate a visual preview showing color swatches with proper variable bindings
- Display a real-time log of the import process

The preview frame helps you immediately see your design system in action and verify that all variables are properly configured.