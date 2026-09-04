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
  x1: 4,
  x2: 8,
  x3: 12,
  x4: 16,
  x5: 20,
  x6: 24,
  x7: 28,
  x8: 32,
  x9: 36,
  x10: 40,
  x11: 44,
  x12: 48,
  x13: 52,
  x14: 56,
  x15: 60,
  x16: 64,
  x17: 68,
  x18: 72,
  x19: 76,
  x20: 80,
  x21: 84,
  x22: 88,
  x23: 92,
  x24: 96,
  x25: 100,
  x26: 104,
  x27: 108,
  x28: 112,
  x29: 116,
  x30: 120,
  x31: 124,
  x32: 128,
  x33: 132,
  x34: 136,
  x35: 140,
  x36: 144,
  x37: 148,
  x38: 152,
  x39: 156,
  x40: 160,
  x41: 164,
  x42: 168,
  x43: 172,
  x44: 176,
  x45: 180,
  x46: 184,
  x47: 188,
  x48: 192,
  x49: 196,
  x50: 200,
  x51: 204,
  x52: 208,
  x53: 212,
  x54: 216,
  x55: 220,
  x56: 224,
  x57: 228,
  x58: 232,
  x59: 236,
  x60: 240,
  x61: 244,
  x62: 248,
  x63: 252,
  x64: 256,
  x65: 260,
  x66: 264,
  x67: 268,
  x68: 272,
  x69: 276,
  x70: 280,
  x71: 284,
  x72: 288,
  x73: 292,
  x74: 296,
  x75: 300,
  x76: 304,
  x77: 308,
  x78: 312,
  x79: 316,
  x80: 320,
  x81: 324,
  x82: 328,
  x83: 332,
  x84: 336,
  x85: 340,
  x86: 344,
  x87: 348,
  x88: 352,
  x89: 356,
  x90: 360,
  x91: 364,
  x92: 368,
  x93: 372,
  x94: 376,
  x95: 380,
  x96: 384,
  x97: 388,
  x98: 392,
  x99: 396,
  x100: 400,
};

const letterSpacing = {
  base: 0,
  tiny: -0.25,
  small: -0.5,
  large: -1,
  xLarge: -1.25,
  xxLarge: -1.5,
  xxxLarge: -2,
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
            .padStart(2, '0'),
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
      'COLOR',
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
      'FLOAT',
    );
    variable.setValueForMode(collection.modes[0].modeId, values);
    variableMap[namespace] = variable;
  } else {
    for (const [key, value] of Object.entries(values)) {
      const fullKey = `${namespace}/${key}`;
      const variable = figma.variables.createVariable(
        fullKey,
        collection,
        'FLOAT',
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
      variableMap,
    );
  }

  // Typography Collection
  const fontCollection = createVariableCollection('Typography');

  createNumberVariables(fontCollection, 'fontSize', fontSizes, variableMap);
  createNumberVariables(
    fontCollection,
    'letterSpacing',
    letterSpacing,
    variableMap,
  );

  figma.closePlugin('Variables created.');
})();
