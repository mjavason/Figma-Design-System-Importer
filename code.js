// ==============================================
// Configuration - Dynamic and Efficient
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
      result[key] = hex;
    } else {
      const index = i < 5 ? 5 - i : i - 6 + 1;
      const factor = i < 5 ? index * 0.1 : -index * 0.1;
      const mixed = mix(baseRgb, factor);
      result[key] = rgbToHex(...mixed);
    }
  });

  return result;
}

const baseColors = {
  brand: '#2F7F7B',
  supplementary: '#D6D397',
  black: '#424667',
  tertiary: '#BDC7C6',
  white: '#FFFFFF',
  // warning: '#417DF3',
  // success: '#2CC36B',
  // error: '#E03131',
};

const dynamicColors = {};
for (const key in baseColors) {
  dynamicColors[key] = generateShades(baseColors[key]);
}

const config = {
  colors: dynamicColors,
  typography: {
    fontFamily: 'Roboto',
    fontStyles: [
      { name: 'Light', weight: 300, style: 'Light' },
      { name: 'Regular', weight: 400, style: 'Regular' },
      { name: 'Medium', weight: 500, style: 'Medium' },
      { name: 'Bold', weight: 700, style: 'Bold' },
    ],
    fontSizes: [48, 36, 24, 18, 16, 14, 12, 10],
    lineHeightMultiplier: 1.2,
    sampleText: 'The quick brown fox jumps over the lazy dog',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 40,
  },
  layout: {
    pagePadding: 40,
    sectionSpacing: 40,
    sectionPadding: 24,
    sectionCornerRadius: 8,
    colorSwatchSize: 48,
    textSampleSpacing: 12,
    fontWeightSectionSpacing: 20,
    fontWeightColumnSpacing: 60,
  },
};

const colorSections = Object.keys(config.colors).map((key) => ({
  title: key.charAt(0).toUpperCase() + key.slice(1),
  colors: config.colors[key],
}));

// ==============================================
// UI Setup - Stable (works well, unlikely to need changes)
// ==============================================

/**
 * Sets up the plugin UI with a log display
 */
function setupUI() {
  figma.showUI(
    `
    <div style="font-family: monospace; padding: 16px; white-space: pre-wrap;" id="log">Running...</div>
    <script>
      onmessage = (event) => {
        const msg = event.data.pluginMessage;
        if (msg.type === "log") {
          const el = document.getElementById("log");
          el.textContent += "\\n" + msg.text;
        }
      };
    </script>
  `,
    { width: 400, height: 300 }
  );
}

/**
 * Logs messages to the plugin UI
 * @param {string} text - The message to log
 */
const log = (text) => figma.ui.postMessage({ type: 'log', text });

// ==============================================
// Color Utilities - Stable
// ==============================================

/**
 * Converts hex color to RGB
 * @param {string} hex - Hex color string (e.g. "#FFFFFF")
 * @returns {object} RGB color object with r, g, b values normalized to [0, 1]
 *
 * @example
 * const rgb = hexToRgb("#FF0000");
 * // rgb = { r: 1, g: 0, b: 0 }
 */
const hexToRgb = (hex) => {
  const val = hex.replace('#', '');
  const r = parseInt(val.slice(0, 2), 16) / 255;
  const g = parseInt(val.slice(2, 4), 16) / 255;
  const b = parseInt(val.slice(4, 6), 16) / 255;
  return { r, g, b };
};

/**
 * Converts a hex color string to a Figma solid paint object.
 * @param {string} hex - Hexadecimal color string (e.g. "#FFFFFF")
 * @returns {Paint} Figma solid paint object with normalized RGB values
 *
 * @example
 * const paint = hexToRgbPaint("#00FF00");
 * // paint = {
 * //   type: "SOLID",
 * //   color: { r: 0, g: 1, b: 0 }
 * // }
 */
function hexToRgbPaint(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    type: 'SOLID',
    color: {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255,
    },
  };
}

// ==============================================
// Core Functions - Stable
// ==============================================

/**
 * Creates a variable collection
 * @param {string} name - Collection name
 * @returns {VariableCollection} The created collection
 *
 * @example
 * const collection = createVariableCollection("MyTheme");
 * // collection.name === "MyTheme"
 */
const createVariableCollection = (name) => {
  return figma.variables.createVariableCollection(name);
};

/**
 * Creates or finds the design system page
 * @returns {PageNode} The design system page
 *
 * @example
 * const page = getOrCreateDesignSystemPage();
 * // If a page named "Design System" exists, it is returned
 * // Otherwise, a new one is created and returned
 */
const setupDesignSystemPage = () => {
  const existing = figma.root.children.find((p) => p.name === 'Design System');
  const dsPage = existing || figma.createPage();
  dsPage.name = 'Design System';
  figma.currentPage = dsPage;
  return dsPage;
};

/**
 * Creates the main container frame
 * @returns {FrameNode} The main frame
 *
 * @example
 * const mainFrame = createMainFrame();
 * // mainFrame is a new FrameNode ready for content
 */
const createMainFrame = () => {
  const mainFrame = figma.createFrame();
  mainFrame.name = 'Design System';
  mainFrame.layoutMode = 'HORIZONTAL';
  mainFrame.counterAxisSizingMode = 'AUTO';
  mainFrame.primaryAxisSizingMode = 'AUTO';
  mainFrame.itemSpacing = config.layout.sectionSpacing;
  mainFrame.paddingTop = config.layout.pagePadding;
  mainFrame.paddingBottom = config.layout.pagePadding;
  mainFrame.paddingLeft = config.layout.pagePadding;
  mainFrame.paddingRight = config.layout.pagePadding;
  mainFrame.x = 0;
  mainFrame.y = 0;
  mainFrame.fills = [];
  return mainFrame;
};

/**
 * Creates color variables in a collection
 * @param {VariableCollection} collection - Target collection
 * @param {string} namespace - Variable namespace
 * @param {object} colors - Color values as object (e.g., { primary: "#FF0000" }) or JSON string
 * @param {object} variableMap - Object to store variable references
 *
 * @example
 * const collection = figma.variables.createVariableCollection("MyCollection");
 * const variableMap = {};
 * createColorVariables(collection, "theme", { primary: "#FF0000", secondary: "#00FF00" }, variableMap);
 * // variableMap now contains references to the created variables:
 * // { primary: Variable, secondary: Variable }
 */
const createColorVariables = (collection, namespace, colors, variableMap) => {
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
};

/**
 * Creates number variables in a collection
 * @param {VariableCollection} collection - Target collection
 * @param {string} namespace - Variable namespace
 * @param {object|number} values - Number values as object (e.g., { spacingSmall: 8 }) or single number
 * @param {object} variableMap - Object to store variable references
 *
 * @example
 * const collection = figma.variables.createVariableCollection("Sizing");
 * const variableMap = {};
 * createNumberVariables(collection, "spacing", { small: 8, medium: 16 }, variableMap);
 * // variableMap = { small: Variable, medium: Variable }
 */
const createNumberVariables = (collection, namespace, values, variableMap) => {
  if (typeof values === 'number') {
    const variable = figma.variables.createVariable(
      `${namespace}`,
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
};

/**
 * Loads all required fonts asynchronously
 */
async function loadFonts() {
  try {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    log('Loaded default font: Inter Regular');

    for (const style of config.typography.fontStyles) {
      await figma.loadFontAsync({
        family: config.typography.fontFamily,
        style: style.style,
      });
      log(`Loaded font: ${config.typography.fontFamily} ${style.style}`);
    }
  } catch (e) {
    log(`Font loading error: ${e.message}`);
    throw e;
  }
}

/**
 * Safely creates text with default font
 * @param {string} content - Text content
 * @param {object} options - Text options (fontSize, fontWeight, lineHeight, fills)
 * @returns {TextNode} The created text node
 *
 * @example
 * const textNode = await createSafeText("Hello, world", { fontSize: 24, fills: [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }] });
 * // textNode contains the created text with specified options
 */
async function createSafeText(content, options = {}) {
  const defaultFont = figma.getNodeById(figma.root.id).fontName || {
    family: 'Roboto',
    style: 'Regular',
  };
  await figma.loadFontAsync(defaultFont);

  const text = figma.createText();
  text.fontName = defaultFont;
  text.characters = content;

  if (options.fontSize) text.fontSize = options.fontSize;
  // if (options.fontWeight) text.fontWeight = options.fontWeight; // cant set for some reason
  if (options.lineHeight) text.lineHeight = options.lineHeight;
  if (options.fills) text.fills = options.fills;

  return text;
}

// ==============================================
// Section Creation Functions
// ==============================================

/**
 * Creates the typography section
 * @param {object} variableMap - Map of created variables
 * @returns {FrameNode} The typography frame
 *
 * @example
 * const vars = {};
 * const typographyFrame = createTypographySection(vars);
 * // typographyFrame contains text nodes linked to variables in vars
 */
const createTypographySection = async (variableMap) => {
  const typographyFrame = figma.createFrame();
  typographyFrame.name = 'Typography';
  typographyFrame.layoutMode = 'VERTICAL';
  typographyFrame.counterAxisSizingMode = 'AUTO';
  typographyFrame.primaryAxisSizingMode = 'AUTO';
  typographyFrame.itemSpacing = config.layout.sectionSpacing;
  typographyFrame.paddingTop = config.layout.sectionPadding;
  typographyFrame.paddingBottom = config.layout.sectionPadding;
  typographyFrame.paddingLeft = config.layout.sectionPadding;
  typographyFrame.paddingRight = config.layout.sectionPadding;
  typographyFrame.fills = [hexToRgbPaint('#FFFFFF')];

  const weightsFrame = await createFontWeightsFrame(variableMap);

  typographyFrame.appendChild(weightsFrame);

  return typographyFrame;
};

/**
 * Creates the font weights frame
 * @param {object} variableMap - Map of created variables
 * @returns {Promise<FrameNode>} The weights frame
 *
 * @example
 * const vars = {};
 * const weightsFrame = await createFontWeightsFrame(vars);
 * // weightsFrame contains text nodes styled by font weight variables
 */
const createFontWeightsFrame = async (variableMap) => {
  const weightsFrame = figma.createFrame();

  weightsFrame.name = 'Font Weights';
  weightsFrame.layoutMode = 'HORIZONTAL';
  weightsFrame.counterAxisSizingMode = 'AUTO';
  weightsFrame.primaryAxisSizingMode = 'AUTO';
  weightsFrame.itemSpacing = config.layout.fontWeightColumnSpacing;
  weightsFrame.fills = [];

  for (const fontStyle of config.typography.fontStyles) {
    log(JSON.stringify(fontStyle));
    const weightSection = await createWeightSection(fontStyle, variableMap);
    weightsFrame.appendChild(weightSection);
  }

  return weightsFrame;
};

/**
 * Creates the weight title group
 * @param {string} fontName - Font weight name
 * @param {object} variableMap - Map of variables
 * @returns {GroupNode} The title group
 *
 * @example
 * const vars = {};
 * const group = createWeightTitleGroup("Bold", vars);
 * // group is a GroupNode with title text styled as Bold
 */
async function createWeightTitle(fontName, variableMap) {
  const weightTitle = figma.createRectangle();
  weightTitle.resize(120, 36);

  if (variableMap['color/black/base']) {
    weightTitle.fills = [
      {
        type: 'SOLID',
        color: { r: 1, g: 1, b: 1 },
        boundVariables: {
          color: {
            type: 'VARIABLE_ALIAS',
            id: variableMap['color/black/base'].id,
          },
        },
      },
    ];
  } else {
    weightTitle.fills = [{ type: 'SOLID', color: hexToRgb('#000000') }];
  }

  weightTitle.cornerRadius = 4;

  const weightTitleText = await createSafeText(fontName, {
    fontSize: 14,
    fontWeight: config.typography.fontStyles.find((s) => s.name === 'Medium')
      .weight,
    fills: variableMap['color/black/base']
      ? [
          {
            type: 'SOLID',
            color: { r: 1, g: 1, b: 1 },
            boundVariables: {
              color: {
                type: 'VARIABLE_ALIAS',
                id: variableMap['color/black/base'].id,
              },
            },
          },
        ]
      : [{ type: 'SOLID', color: hexToRgb('#000000') }],
  });

  weightTitleText.resize(120, 36);
  weightTitleText.textAlignHorizontal = 'CENTER';
  weightTitleText.textAlignVertical = 'CENTER';

  // Create a parent frame for the group
  const container = figma.createFrame();
  container.resize(120, 36);
  container.fills = [];

  // Position elements at (0,0) within the container
  weightTitle.x = 0;
  weightTitle.y = 0;
  weightTitleText.x = 0;
  weightTitleText.y = 0;

  container.appendChild(weightTitle);
  container.appendChild(weightTitleText);

  return container;
}

/**
 * Creates a single font weight section
 * @param {object} fontStyle - Font style config
 * @param {object} variableMap - Map of variables
 * @returns {FrameNode} The weight section frame
 *
 * @example
 * const vars = {};
 * const fontStyle = { name: "Regular", weight: 400 };
 * const section = createFontWeightSection(fontStyle, vars);
 * // section is a FrameNode representing the font weight section
 */
async function createWeightSection(fontStyle, variableMap) {
  const weightSection = figma.createFrame();
  weightSection.name = fontStyle.name;
  weightSection.layoutMode = 'VERTICAL';
  weightSection.counterAxisSizingMode = 'AUTO';
  weightSection.primaryAxisSizingMode = 'AUTO';
  weightSection.itemSpacing = config.layout.fontWeightSectionSpacing;
  weightSection.fills = [];

  const titleGroup = await createWeightTitle(fontStyle.name, variableMap);
  weightSection.appendChild(titleGroup);

  for (const fontSize of config.typography.fontSizes) {
    try {
      const text = await createSafeText(config.typography.sampleText, {
        fontSize: variableMap[`fontSize/${fontSize}`] ? undefined : fontSize,
        fontWeight: variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`]
          ? undefined
          : fontStyle.weight,
        lineHeight: {
          value: fontSize * config.typography.lineHeightMultiplier,
          unit: 'PIXELS',
        },
        fills: variableMap['color/black/base']
          ? [
              {
                type: 'SOLID',
                color: { r: 1, g: 1, b: 1 },
                boundVariables: {
                  color: {
                    type: 'VARIABLE_ALIAS',
                    id: variableMap['color/black/base'].id,
                  },
                },
              },
            ]
          : [{ type: 'SOLID', color: hexToRgb(config.colors.black[900]) }],
      });

      if (variableMap[`fontSize/${fontSize}`]) {
        text.setBoundVariable('fontSize', {
          type: 'VARIABLE_ALIAS',
          id: variableMap[`fontSize/${fontSize}`].id,
        });
      }

      if (variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`]) {
        text.setBoundVariable('fontWeight', {
          type: 'VARIABLE_ALIAS',
          id: variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`].id,
        });
      }

      weightSection.appendChild(text);
    } catch (textError) {
      log(
        `Failed to create text for ${fontStyle.name} at ${fontSize}px: ${textError.message}`
      );
    }
  }

  return weightSection;
}

/**
 * Creates text samples for a font weight
 * @param {object} fontStyle - Font style config
 * @param {object} variableMap - Map of variables
 * @returns {FrameNode} The text samples frame
 *
 * @example
 * const vars = {};
 * const fontStyle = { name: "Medium", weight: 500 };
 * const samplesFrame = createTextSamples(fontStyle, vars);
 * // samplesFrame contains text nodes showing samples in specified font style
 */
async function createTextSamples(fontStyle, variableMap) {
  const textColumn = figma.createFrame();
  textColumn.name = `${fontStyle.name} Texts`;
  textColumn.layoutMode = 'VERTICAL';
  textColumn.counterAxisSizingMode = 'AUTO';
  textColumn.primaryAxisSizingMode = 'AUTO';
  textColumn.itemSpacing = config.layout.textSampleSpacing;
  textColumn.fills = [];

  for (const fontSize of config.typography.fontSizes) {
    try {
      const text = await createSafeText(config.typography.sampleText, {
        fontSize: variableMap[`fontSize/${fontSize}`] ? undefined : fontSize,
        fontWeight: variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`]
          ? undefined
          : fontStyle.weight,
        lineHeight: {
          value: fontSize * config.typography.lineHeightMultiplier,
          unit: 'PIXELS',
        },
        fills: variableMap['color/black/base']
          ? [
              {
                type: 'SOLID',
                color: { r: 1, g: 1, b: 1 },
                boundVariables: {
                  color: {
                    type: 'VARIABLE_ALIAS',
                    id: variableMap['color/black/base'].id,
                  },
                },
              },
            ]
          : [{ type: 'SOLID', color: hexToRgb(config.colors.black[900]) }],
      });

      if (variableMap[`fontSize/${fontSize}`]) {
        text.setBoundVariable('fontSize', {
          type: 'VARIABLE_ALIAS',
          id: variableMap[`fontSize/${fontSize}`].id,
        });
      }

      if (variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`]) {
        text.setBoundVariable('fontWeight', {
          type: 'VARIABLE_ALIAS',
          id: variableMap[`fontWeight/${fontStyle.name.toLowerCase()}`].id,
        });
      }

      textColumn.appendChild(text);
    } catch (textError) {
      log(
        `Failed to create text for ${fontStyle.name} at ${fontSize}px: ${textError.message}`
      );
    }
  }

  return textColumn;
}

/**
 * Creates the colors section
 * @param {object} variableMap - Map of created variables
 * @returns {FrameNode} The colors frame
 *
 * @example
 * const vars = {};
 * const colorsFrame = createColorsSection(vars);
 * // colorsFrame contains color swatches linked to variables in vars
 */
const createColorsSection = (variableMap) => {
  const colorsFrame = figma.createFrame();
  colorsFrame.name = 'Colors';
  colorsFrame.layoutMode = 'VERTICAL';
  colorsFrame.counterAxisSizingMode = 'AUTO';
  colorsFrame.primaryAxisSizingMode = 'AUTO';
  colorsFrame.itemSpacing = config.layout.sectionSpacing;
  colorsFrame.paddingTop = config.layout.sectionPadding;
  colorsFrame.paddingBottom = config.layout.sectionPadding;
  colorsFrame.paddingLeft = config.layout.sectionPadding;
  colorsFrame.paddingRight = config.layout.sectionPadding;
  colorsFrame.fills = [hexToRgbPaint('#FFFFFF')];

  colorSections.forEach(({ title, colors }) => {
    const section = createColorSection(title, colors, variableMap);
    colorsFrame.appendChild(section);
  });

  return colorsFrame;
};

/**
 * Creates a color section
 * @param {string} title - Section title
 * @param {object} colors - Color values as object (e.g., { primary: "#0000FF" })
 * @param {object} variableMap - Map of variables
 * @returns {FrameNode} The color section frame
 *
 * @example
 * const vars = {};
 * const section = createColorSection("Brand Colors", { primary: "#0000FF", accent: "#FF00FF" }, vars);
 * // section is a FrameNode displaying color swatches for the specified colors
 */
const createColorSection = (title, colors, variableMap) => {
  const section = figma.createFrame();
  section.name = title;
  section.layoutMode = 'VERTICAL';
  section.counterAxisSizingMode = 'AUTO';
  section.primaryAxisSizingMode = 'FIXED';
  section.layoutAlign = 'STRETCH';
  section.itemSpacing = config.layout.sectionPadding;
  section.fills = [];

  const titleText = figma.createText();
  titleText.characters = title;
  titleText.fontSize = 18;
  section.appendChild(titleText);

  const swatchRow = figma.createFrame();
  swatchRow.name = 'swatch-row';
  swatchRow.layoutMode = 'HORIZONTAL';
  swatchRow.counterAxisSizingMode = 'AUTO';
  swatchRow.primaryAxisSizingMode = 'FIXED';
  swatchRow.layoutAlign = 'STRETCH';
  swatchRow.itemSpacing = 8;
  swatchRow.fills = [];

  for (const [key, value] of Object.entries(colors)) {
    const swatch = createColorSwatch(`${title}/${key}`, value, variableMap);
    swatchRow.appendChild(swatch);
  }

  section.appendChild(swatchRow);
  return section;
};

/**
 * Creates a color swatch
 * @param {string} name - Swatch name
 * @param {string} color - Color value (hex string)
 * @param {object} variableMap - Map of variables
 * @returns {FrameNode} The color swatch frame
 *
 * @example
 * const vars = {};
 * const swatch = createColorSwatch("Primary", "#123456", vars);
 * // swatch is a FrameNode representing the color named "Primary"
 */
const createColorSwatch = (name, color, variableMap) => {
  const swatch = figma.createFrame();
  swatch.name = name;
  swatch.resize(config.layout.colorSwatchSize, config.layout.colorSwatchSize);
  swatch.cornerRadius = config.layout.sectionCornerRadius;

  if (variableMap[`color/${name.toLowerCase()}`]) {
    swatch.fills = [
      {
        type: 'SOLID',
        color: { r: 1, g: 1, b: 1 },
        boundVariables: {
          color: {
            type: 'VARIABLE_ALIAS',
            id: variableMap[`color/${name.toLowerCase()}`].id,
          },
        },
      },
    ];
  } else {
    swatch.fills = [{ type: 'SOLID', color: hexToRgb(color) }];
  }

  return swatch;
};

// ==============================================
// Main Execution
// ==============================================

/**
 * Creates all variables for the design system
 * @param {object} variableMap - Object to store variable references
 *
 * @example
 * const vars = {};
 * createAllVariables(vars);
 * // vars now contains references to all created design system variables
 */
function createAllVariables(variableMap) {
  const colorCollection = createVariableCollection('Colors');
  for (const [group, shades] of Object.entries(config.colors)) {
    createColorVariables(
      colorCollection,
      `color/${group}`,
      shades,
      variableMap
    );
  }

  const typographyCollection = createVariableCollection('Typography');
  for (const size of config.typography.fontSizes) {
    createNumberVariables(
      typographyCollection,
      `fontSize/${size}`,
      size,
      variableMap
    );
  }
  for (const style of config.typography.fontStyles) {
    createNumberVariables(
      typographyCollection,
      `fontWeight/${style.name.toLowerCase()}`,
      style.weight,
      variableMap
    );
  }

  const spacingCollection = createVariableCollection('Spacing');
  for (const [key, value] of Object.entries(config.spacing)) {
    createNumberVariables(
      spacingCollection,
      `spacing/${key}`,
      value,
      variableMap
    );
  }
}

(async () => {
  try {
    setupUI();
    log('Initializing design system...');

    const dsPage = setupDesignSystemPage();

    log('Clearing variable collections...');
    for (const c of figma.variables.getLocalVariableCollections()) c.remove();

    log('Loading fonts...');
    await loadFonts();

    const variableMap = {};
    log('Creating variable collections...');
    createAllVariables(variableMap);

    const mainFrame = createMainFrame();
    dsPage.appendChild(mainFrame);

    log('Creating typography section...');
    const typographyFrame = await createTypographySection(variableMap);
    mainFrame.appendChild(typographyFrame);

    log('Creating colors section...');
    const colorsFrame = createColorsSection(variableMap);
    mainFrame.appendChild(colorsFrame);
    log('Design system setup complete.');
    // figma.closePlugin('Done.');
  } catch (e) {
    log('Error: ' + e.message);
    // figma.closePlugin('Error occurred - see logs');
  }
})();
