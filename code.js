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

const log = (text) => figma.ui.postMessage({ type: 'log', text });

const hexToRgb = (hex) => {
  const val = hex.replace('#', '');
  const r = parseInt(val.slice(0, 2), 16) / 255;
  const g = parseInt(val.slice(2, 4), 16) / 255;
  const b = parseInt(val.slice(4, 6), 16) / 255;
  return { r, g, b };
};

(async () => {
  try {
    log('Creating design system page...');
    const existing = figma.root.children.find(
      (p) => p.name === 'Design System'
    );
    const dsPage = existing || figma.createPage();
    dsPage.name = 'Design System';
    figma.currentPage = dsPage;

    log('Clearing variable collections...');
    for (const c of figma.variables.getLocalVariableCollections()) c.remove();

    log('Deleting local styles...');
    figma.getLocalPaintStyles().forEach((s) => s.remove());
    figma.getLocalTextStyles().forEach((s) => s.remove());
    figma.getLocalEffectStyles().forEach((s) => s.remove());
    figma.getLocalGridStyles().forEach((s) => s.remove());

    log('Loading fonts...');
    await figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Roboto', style: 'Medium' });
    await figma.loadFontAsync({ family: 'Roboto', style: 'Bold' });

    const colors = {
      white: '#FFFFFF',
      brand: {
        25: '#F5F8FF',
        50: '#EBF2FF',
        100: '#D1E0FF',
        200: '#B3CCFF',
        300: '#84ADFF',
        400: '#528BFF',
        500: '#2563EB',
        600: '#1D4ED8',
        700: '#1E40AF',
        800: '#1E3A8A',
        900: '#1E3A8A',
      },
      supplementary: {
        25: '#F0FDFF',
        50: '#ECFEFF',
        100: '#CFFAFE',
        200: '#A5F3FC',
        300: '#67E8F9',
        400: '#22D3EE',
        500: '#06B6D4',
        600: '#0891B2',
        700: '#0E7490',
        800: '#155E75',
        900: '#164E63',
      },
      black: {
        25: '#FCFCFD',
        50: '#F9FAFB',
        100: '#F2F4F7',
        200: '#E4E7EC',
        300: '#D0D5DD',
        400: '#98A2B3',
        500: '#667085',
        600: '#475467',
        700: '#344054',
        800: '#1D2939',
        900: '#101828',
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        400: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
      },
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
      },
    };

    const typography = {
      display: { fontSize: 48, fontWeight: 700, lineHeight: 60 },
      heading: { fontSize: 32, fontWeight: 600, lineHeight: 40 },
      body: { fontSize: 16, fontWeight: 400, lineHeight: 24 },
      caption: { fontSize: 12, fontWeight: 500, lineHeight: 18 },
    };

    const variableMap = {};

    const createVariableCollection = (name) => {
      return figma.variables.createVariableCollection(name);
    };

    const createColorVariables = (collection, namespace, colors) => {
      if (typeof colors === 'string') {
        const variable = figma.variables.createVariable(
          `${namespace}`,
          collection,
          'COLOR'
        );
        variable.setValueForMode(collection.modes[0].modeId, hexToRgb(colors));
        variableMap[namespace] = variable;
      } else {
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
    };

    log('Creating variable collections...');
    const colorCollection = createVariableCollection('Colors');
    createColorVariables(colorCollection, 'color/white', colors.white);
    createColorVariables(colorCollection, 'color/brand', colors.brand);
    createColorVariables(
      colorCollection,
      'color/supplementary',
      colors.supplementary
    );
    createColorVariables(colorCollection, 'color/black', colors.black);
    createColorVariables(colorCollection, 'color/warning', colors.warning);
    createColorVariables(colorCollection, 'color/success', colors.success);
    createColorVariables(colorCollection, 'color/error', colors.error);

    const typeCollection = createVariableCollection('Typography');
    for (const [key, val] of Object.entries(typography)) {
      const size = figma.variables.createVariable(
        `type/${key}/size`,
        typeCollection,
        'FLOAT'
      );
      const weight = figma.variables.createVariable(
        `type/${key}/weight`,
        typeCollection,
        'FLOAT'
      );
      const lineHeight = figma.variables.createVariable(
        `type/${key}/lineHeight`,
        typeCollection,
        'FLOAT'
      );
      size.setValueForMode(typeCollection.modes[0].modeId, val.fontSize);
      weight.setValueForMode(typeCollection.modes[0].modeId, val.fontWeight);
      lineHeight.setValueForMode(
        typeCollection.modes[0].modeId,
        val.lineHeight
      );
      variableMap[`type/${key}/size`] = size;
      variableMap[`type/${key}/weight`] = weight;
      variableMap[`type/${key}/lineHeight`] = lineHeight;
    }

    log('Creating main container...');
    const mainFrame = figma.createFrame();
    mainFrame.name = 'Design System';
    mainFrame.layoutMode = 'HORIZONTAL';
    mainFrame.counterAxisSizingMode = 'AUTO';
    mainFrame.primaryAxisSizingMode = 'AUTO';
    mainFrame.itemSpacing = 40;
    mainFrame.paddingTop = 40;
    mainFrame.paddingBottom = 40;
    mainFrame.paddingLeft = 40;
    mainFrame.paddingRight = 40;
    mainFrame.x = 0;
    mainFrame.y = 0;
    mainFrame.fills = [];
    dsPage.appendChild(mainFrame);

    log('Creating typography section...');
    const typographyFrame = figma.createFrame();
    typographyFrame.name = 'Typography';
    typographyFrame.layoutMode = 'VERTICAL';
    typographyFrame.counterAxisSizingMode = 'AUTO';
    typographyFrame.primaryAxisSizingMode = 'AUTO';
    typographyFrame.itemSpacing = 24;
    typographyFrame.paddingTop = 24;
    typographyFrame.paddingBottom = 24;
    typographyFrame.paddingLeft = 24;
    typographyFrame.paddingRight = 24;
    typographyFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    typographyFrame.cornerRadius = 8;

    const typeTitle = figma.createText();
    typeTitle.fontName = { family: 'Roboto', style: 'Medium' };
    typeTitle.characters = 'Typography';
    typeTitle.fontSize = 20;
    typographyFrame.appendChild(typeTitle);

    const createTypographySection = (title, sizes) => {
      const section = figma.createFrame();
      section.name = title;
      section.layoutMode = 'VERTICAL';
      section.counterAxisSizingMode = 'AUTO';
      section.primaryAxisSizingMode = 'AUTO';
      section.itemSpacing = 8;
      section.fills = [];

      const sectionTitle = figma.createText();
      sectionTitle.fontName = { family: 'Roboto', style: 'Medium' };
      sectionTitle.characters = title;
      sectionTitle.fontSize = 14;
      const grayVariable = variableMap['color/black/400'];
      if (grayVariable) {
        sectionTitle.fills = [
          {
            type: 'SOLID',
            color: { r: 0.4, g: 0.4, b: 0.4 },
            boundVariables: {
              color: {
                type: 'VARIABLE_ALIAS',
                id: grayVariable.id,
              },
            },
          },
        ];
      } else {
        sectionTitle.fills = [
          { type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } },
        ];
      }
      section.appendChild(sectionTitle);

      for (const size of sizes) {
        const text = figma.createText();
        text.fontName = {
          family: 'Roboto',
          style:
            size === 'Display'
              ? 'Bold'
              : size === 'Heading'
              ? 'Medium'
              : 'Regular',
        };
        text.characters = 'This is the font to use';

        const typeKey = size.toLowerCase();
        const sizeVariable = variableMap[`type/${typeKey}/size`];
        const lineHeightVariable = variableMap[`type/${typeKey}/lineHeight`];
        const textColorVariable = variableMap['color/black/800'];

        if (sizeVariable) {
          text.setBoundVariable('fontSize', sizeVariable);
        } else {
          text.fontSize =
            size === 'Display'
              ? 32
              : size === 'Heading'
              ? 24
              : size === 'Body'
              ? 16
              : 14;
        }

        if (lineHeightVariable) {
          text.setBoundVariable('lineHeight', lineHeightVariable);
        }

        if (textColorVariable) {
          text.fills = [
            {
              type: 'SOLID',
              color: { r: 0.1, g: 0.1, b: 0.1 },
              boundVariables: {
                color: {
                  type: 'VARIABLE_ALIAS',
                  id: textColorVariable.id,
                },
              },
            },
          ];
        } else {
          text.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
        }

        section.appendChild(text);
      }

      return section;
    };

    const displaySection = createTypographySection('Display', ['Display']);
    const headingSection = createTypographySection('Heading', ['Heading']);
    const bodySection = createTypographySection('Body', ['Body']);
    const captionSection = createTypographySection('Caption', ['Caption']);

    typographyFrame.appendChild(displaySection);
    typographyFrame.appendChild(headingSection);
    typographyFrame.appendChild(bodySection);
    typographyFrame.appendChild(captionSection);

    mainFrame.appendChild(typographyFrame);

    log('Creating colors section...');
    const colorsFrame = figma.createFrame();
    colorsFrame.name = 'Colors';
    colorsFrame.layoutMode = 'VERTICAL';
    colorsFrame.counterAxisSizingMode = 'AUTO';
    colorsFrame.primaryAxisSizingMode = 'AUTO';
    colorsFrame.itemSpacing = 32;
    colorsFrame.paddingTop = 24;
    colorsFrame.paddingBottom = 24;
    colorsFrame.paddingLeft = 24;
    colorsFrame.paddingRight = 24;
    colorsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    colorsFrame.cornerRadius = 8;

    const colorsTitle = figma.createText();
    colorsTitle.fontName = { family: 'Roboto', style: 'Medium' };
    colorsTitle.characters = 'Colors';
    colorsTitle.fontSize = 20;
    colorsFrame.appendChild(colorsTitle);

    const createColorSection = (title, colorSet) => {
      const section = figma.createFrame();
      section.name = title;
      section.layoutMode = 'VERTICAL';
      section.counterAxisSizingMode = 'AUTO';
      section.primaryAxisSizingMode = 'AUTO';
      section.itemSpacing = 8;
      section.fills = [];

      const sectionTitle = figma.createText();
      sectionTitle.fontName = { family: 'Roboto', style: 'Medium' };
      sectionTitle.characters = title;
      sectionTitle.fontSize = 14;
      sectionTitle.fills = [
        { type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } },
      ];
      section.appendChild(sectionTitle);

      const colorRow = figma.createFrame();
      colorRow.name = `${title} Row`;
      colorRow.layoutMode = 'HORIZONTAL';
      colorRow.counterAxisSizingMode = 'AUTO';
      colorRow.primaryAxisSizingMode = 'AUTO';
      colorRow.itemSpacing = 0;
      colorRow.fills = [];

      if (typeof colorSet === 'string') {
        const colorSwatch = figma.createRectangle();
        colorSwatch.resize(48, 48);
        const variableKey = `color/${title.toLowerCase()}`;
        const variable = variableMap[variableKey];
        if (variable) {
          colorSwatch.fills = [
            {
              type: 'SOLID',
              color: { r: 1, g: 1, b: 1 },
              boundVariables: {
                color: {
                  type: 'VARIABLE_ALIAS',
                  id: variable.id,
                },
              },
            },
          ];
        } else {
          colorSwatch.fills = [{ type: 'SOLID', color: hexToRgb(colorSet) }];
        }
        colorRow.appendChild(colorSwatch);
      } else {
        const weights = [
          '25',
          '50',
          '100',
          '200',
          '300',
          '400',
          '500',
          '600',
          '700',
          '800',
          '900',
        ];
        for (const weight of weights) {
          if (colorSet[weight]) {
            const colorSwatch = figma.createRectangle();
            colorSwatch.resize(48, 48);
            const variableKey = `color/${title
              .toLowerCase()
              .replace(' color', '')
              .replace(' ', '')}/${weight}`;
            const variable = variableMap[variableKey];
            if (variable) {
              colorSwatch.fills = [
                {
                  type: 'SOLID',
                  color: { r: 1, g: 1, b: 1 },
                  boundVariables: {
                    color: {
                      type: 'VARIABLE_ALIAS',
                      id: variable.id,
                    },
                  },
                },
              ];
            } else {
              colorSwatch.fills = [
                { type: 'SOLID', color: hexToRgb(colorSet[weight]) },
              ];
            }
            colorRow.appendChild(colorSwatch);
          }
        }
      }

      section.appendChild(colorRow);
      return section;
    };

    const whiteSection = createColorSection('White', colors.white);
    const brandSection = createColorSection('Brand Color', colors.brand);
    const supplementarySection = createColorSection(
      'Supplementary',
      colors.supplementary
    );
    const blackSection = createColorSection('Black', colors.black);
    const warningSection = createColorSection('Warning', colors.warning);
    const successSection = createColorSection('Success', colors.success);
    const errorSection = createColorSection('Error', colors.error);

    colorsFrame.appendChild(whiteSection);
    colorsFrame.appendChild(brandSection);
    colorsFrame.appendChild(supplementarySection);
    colorsFrame.appendChild(blackSection);
    colorsFrame.appendChild(warningSection);
    colorsFrame.appendChild(successSection);
    colorsFrame.appendChild(errorSection);

    mainFrame.appendChild(colorsFrame);

    log('Design system setup complete.');
    figma.closePlugin('Done.');
  } catch (e) {
    log('Error: ' + e.message);
  }
})();
