figma.showUI(`
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
`, { width: 400, height: 300 });

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
    log("Clearing existing variable collections...");
    for (const c of figma.variables.getLocalVariableCollections()) {
      c.remove();
    }

    log("Deleting all local styles...");
    figma.getLocalPaintStyles().forEach(s => s.remove());
    figma.getLocalTextStyles().forEach(s => s.remove());
    figma.getLocalEffectStyles().forEach(s => s.remove());
    figma.getLocalGridStyles().forEach(s => s.remove());

    log("Loading fonts...");
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
      }
    };

    log("Creating color variables...");
    const colorCollection = createVariableCollection('Color Variables');
    createVariables(colorCollection, 'color', colors, 'COLOR');

    log("Creating typography variables...");
    const typeCollection = createVariableCollection('Typography Variables');
    for (const [key, val] of Object.entries(typography)) {
      const size = figma.variables.createVariable(`type/${key}/size`, typeCollection, 'FLOAT');
      const weight = figma.variables.createVariable(`type/${key}/weight`, typeCollection, 'FLOAT');
      size.setValueForMode(typeCollection.modes[0].modeId, val.fontSize);
      weight.setValueForMode(typeCollection.modes[0].modeId, val.fontWeight);
    }

    log("Creating spacing variables...");
    const spacingCollection = createVariableCollection('Spacing Variables');
    createVariables(spacingCollection, 'space', spacing, 'FLOAT');

    log("Setup complete.");
    figma.closePlugin("Done.");
  } catch (e) {
    log("Error: " + e.message);
  }
})();
