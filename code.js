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
      (p) => p.name === '🧱 Design System'
    );
    const dsPage = existing || figma.createPage();
    dsPage.name = '🧱 Design System';
    figma.currentPage = dsPage;

    log('Clearing variable collections...');
    for (const c of figma.variables.getLocalVariableCollections()) c.remove();

    log('Deleting local styles...');
    figma.getLocalPaintStyles().forEach((s) => s.remove());
    figma.getLocalTextStyles().forEach((s) => s.remove());
    figma.getLocalEffectStyles().forEach((s) => s.remove());
    figma.getLocalGridStyles().forEach((s) => s.remove());

    log('Loading fonts...');
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });

    const colors = {
      primary: '#1E3A8A',
      'primary-light': '#3B82F6',
      accent: '#F59E0B',
      neutral: '#111827',
      white: '#FFFFFF',
    };

    const typography = {
      display: { fontSize: 48, fontWeight: 700 },
      heading: { fontSize: 32, fontWeight: 600 },
      body: { fontSize: 16, fontWeight: 400 },
    };

    const spacing = {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    };

    const variableMap = {};

    const createVariableCollection = (name) => {
      return figma.variables.createVariableCollection(name);
    };

    const createVariables = (collection, namespace, vars, type) => {
      for (const [key, value] of Object.entries(vars)) {
        const variable = figma.variables.createVariable(
          `${namespace}/${key}`,
          collection,
          type
        );
        const val = type === 'COLOR' ? hexToRgb(value) : value;
        variable.setValueForMode(collection.modes[0].modeId, val);
        variableMap[`${namespace}/${key}`] = variable;
      }
    };

    log('Creating variable collections...');
    const colorCollection = createVariableCollection('Color Variables');
    createVariables(colorCollection, 'color', colors, 'COLOR');

    const typeCollection = createVariableCollection('Typography Variables');
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
      size.setValueForMode(typeCollection.modes[0].modeId, val.fontSize);
      weight.setValueForMode(typeCollection.modes[0].modeId, val.fontWeight);
      variableMap[`type/${key}/size`] = size;
      variableMap[`type/${key}/weight`] = weight;
    }

    const spacingCollection = createVariableCollection('Spacing Variables');
    createVariables(spacingCollection, 'space', spacing, 'FLOAT');

    log('Generating variable preview frame...');
    const previewFrame = figma.createFrame();
    previewFrame.name = 'Variable Preview';
    previewFrame.layoutMode = 'VERTICAL';
    previewFrame.counterAxisSizingMode = 'AUTO';
    previewFrame.primaryAxisSizingMode = 'AUTO';
    previewFrame.paddingTop = 32;
    previewFrame.paddingBottom = 32;
    previewFrame.paddingLeft = 32;
    previewFrame.paddingRight = 32;
    previewFrame.itemSpacing = 24;
    previewFrame.x = 0;
    previewFrame.y = 0;
    dsPage.appendChild(previewFrame);

    const createColorPreview = (name, variable) => {
      const frame = figma.createFrame();
      frame.layoutMode = 'VERTICAL';
      frame.counterAxisSizingMode = 'AUTO';
      frame.primaryAxisSizingMode = 'AUTO';
      frame.itemSpacing = 4;
      frame.paddingLeft = 0;
      frame.paddingRight = 0;
      frame.paddingTop = 0;
      frame.paddingBottom = 0;
      frame.name = name;

      const rect = figma.createRectangle();
      rect.resize(120, 80);
      rect.name = `${name}-swatch`;

      const solidPaint = {
        type: 'SOLID',
        color: { r: 1, g: 1, b: 1 },
      };

      solidPaint.boundVariables = {
        color: { type: 'VARIABLE_ALIAS', id: variable.id },
      };

      rect.fills = [solidPaint];

      const label = figma.createText();
      label.characters = name;
      label.fontSize = 12;

      frame.appendChild(rect);
      frame.appendChild(label);
      return frame;
    };

    log('Rendering color samples...');
    const colorFrame = figma.createFrame();
    colorFrame.name = 'Color Samples';
    colorFrame.layoutMode = 'HORIZONTAL';
    colorFrame.counterAxisSizingMode = 'AUTO';
    colorFrame.primaryAxisSizingMode = 'AUTO';
    colorFrame.itemSpacing = 16;
    colorFrame.paddingLeft = 16;
    colorFrame.paddingRight = 16;
    colorFrame.paddingTop = 16;
    colorFrame.paddingBottom = 16;

    for (const [name] of Object.entries(colors)) {
      const variable = variableMap[`color/${name}`];
      const preview = createColorPreview(name, variable);
      colorFrame.appendChild(preview);
    }

    previewFrame.appendChild(colorFrame);

    const createTypographyPreview = (name, sizeVariable, weightVariable) => {
      const frame = figma.createFrame();
      frame.layoutMode = 'VERTICAL';
      frame.counterAxisSizingMode = 'AUTO';
      frame.primaryAxisSizingMode = 'AUTO';
      frame.itemSpacing = 4;
      frame.paddingLeft = 0;
      frame.paddingRight = 0;
      frame.paddingTop = 0;
      frame.paddingBottom = 0;
      frame.name = `${name}-type`;

      const text = figma.createText();
      text.characters = `${name} Sample Text`;
      text.fontName = { family: 'Inter', style: 'Regular' };

      text.setBoundVariable('fontSize', sizeVariable);
      text.setBoundVariable('fontWeight', weightVariable);

      const label = figma.createText();
      label.characters = name;
      label.fontSize = 12;
      label.fontName = { family: 'Inter', style: 'Regular' };

      frame.appendChild(text);
      frame.appendChild(label);
      return frame;
    };

    log('Rendering typography samples...');
    const typeFrame = figma.createFrame();
    typeFrame.name = 'Typography Samples';
    typeFrame.layoutMode = 'VERTICAL';
    typeFrame.counterAxisSizingMode = 'AUTO';
    typeFrame.primaryAxisSizingMode = 'AUTO';
    typeFrame.itemSpacing = 16;
    typeFrame.paddingLeft = 16;
    typeFrame.paddingRight = 16;
    typeFrame.paddingTop = 16;
    typeFrame.paddingBottom = 16;

    const typeOrder = ['display', 'heading', 'body'];
    for (const name of typeOrder) {
      const sizeVariable = variableMap[`type/${name}/size`];
      const weightVariable = variableMap[`type/${name}/weight`];
      const preview = createTypographyPreview(
        name,
        sizeVariable,
        weightVariable
      );
      typeFrame.appendChild(preview);
    }

    previewFrame.appendChild(typeFrame);

    log('Design system setup complete.');
    figma.closePlugin('Done.');
  } catch (e) {
    log('Error: ' + e.message);
  }
})();
