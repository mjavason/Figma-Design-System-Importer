// ==============================================
// Editable Configuration
// ==============================================
const baseColors = {
  cinemaRed: '#E50914', // Primary
  goldAccent: '#FFD700', // Secondary
  deepBlack: '#141414', // Background Primary | Primary Contrast
  pureWhite: '#FFFFFF', // Text Primary | Secondary Contrast
  darkGray: '#2F2F2F', // Borders | Dividers | Background Secondary
  lightGray: '#808080', // Text Secondary
};

// If the user has installed the font, it will appear as part of the options in Figma.
const fontFamily = 'Inter';

const fontSizes = {
  hero: 64,
  display: 48,
  h1: 36,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  small: 14,
  caption: 12,
  tiny: 10,
};

// Some design systems enforce a spacing scale for better consistency. Something to consider
const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xLarge: 32,
  xxLarge: 48,
  xxxLarge: 64,
};

// ==============================================
// Utility Functions
// ==============================================

function generateShades(hex) {
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) =>
          Math.max(0, Math.min(255, Math.round(x)))
            .toString(16)
            .padStart(2, '0')
        )
        .join('')
    );
  }

  function mix(color, percent) {
    const mixWith = percent > 0 ? 255 : 0;
    const p = Math.abs(percent);
    return color.map((c) => c + (mixWith - c) * p);
  }

  const baseRgb = hexToRgb(hex);
  const result = {};
  const keys = [10, 20, 30, 40, 50, 'base', 60, 70, 80, 90, 100];

  keys.forEach((key, i) => {
    if (key === 'base') {
      result[key] = hex.startsWith('#') ? hex : `#${hex}`;
    } else {
      const index = i < 5 ? 5 - i : i - 6 + 1;
      const factor = i < 5 ? index * 0.1 : -index * 0.1;
      const mixed = mix(baseRgb, factor);
      result[key] = rgbToHex(...mixed);
    }
  });

  return result;
}

function hexToRgb(hex) {
  const val = hex.replace('#', '');
  return {
    r: parseInt(val.slice(0, 2), 16) / 255,
    g: parseInt(val.slice(2, 4), 16) / 255,
    b: parseInt(val.slice(4, 6), 16) / 255,
  };
}

// ==============================================
// Variable Creation Functions
// ==============================================

function createVariableCollection(name) {
  return figma.variables.createVariableCollection(name);
}

function createColorVariables(collection, namespace, colors, variableMap) {
  for (const [key, value] of Object.entries(colors)) {
    const fullKey = `${namespace}/${key}`;
    const variable = figma.variables.createVariable(
      fullKey,
      collection,
      'COLOR'
    );
    variable.setValueForMode(collection.modes[0].modeId, hexToRgb(value));
    variableMap[fullKey] = variable;
  }
}

function createNumberVariables(collection, namespace, values, variableMap) {
  if (typeof values === 'number') {
    const variable = figma.variables.createVariable(
      namespace,
      collection,
      'FLOAT'
    );
    variable.setValueForMode(collection.modes[0].modeId, values);
    variableMap[namespace] = variable;
  } else {
    for (const [key, value] of Object.entries(values)) {
      const fullKey = `${namespace}/${key}`;
      const variable = figma.variables.createVariable(
        fullKey,
        collection,
        'FLOAT'
      );
      variable.setValueForMode(collection.modes[0].modeId, value);
      variableMap[fullKey] = variable;
    }
  }
}

// ==============================================
// Main Execution
// ==============================================

(function run() {
  for (const collection of figma.variables.getLocalVariableCollections()) {
    collection.remove();
  }

  const variableMap = {};

  const dynamicColors = {};
  for (const key in baseColors) {
    dynamicColors[key] = generateShades(baseColors[key]);
  }

  const colorCollection = createVariableCollection('Colors');
  for (const [group, shades] of Object.entries(dynamicColors)) {
    createColorVariables(
      colorCollection,
      `color/${group}`,
      shades,
      variableMap
    );
  }

  const spacingCollection = createVariableCollection('Spacing');
  createNumberVariables(spacingCollection, 'spacing', spacing, variableMap);

  figma.closePlugin('Variables created.');
})();
