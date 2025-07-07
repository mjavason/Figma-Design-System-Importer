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
  colors:dynamicColors,
  typography: {
    fontFamily: 'Roboto',
    fontStyles: [
      { name: 'Regular', weight: 300, style: 'Regular' },
      { name: 'Medium', weight: 400, style: 'Medium' },
      { name: 'SemiBold', weight: 500, style: 'SemiBold' },
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


console.log(colorSections);
// console.log(dynamicColors)