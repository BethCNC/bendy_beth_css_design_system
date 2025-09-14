#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the tokens.json file
const tokensPath = path.join(__dirname, '../tokens/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Helper function to flatten tokens and add prefix
function flattenTokens(obj, prefix = '', path = []) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...path, key];

    if (value && typeof value === 'object' && value.value !== undefined) {
      // This is a token with a value
      const tokenName = prefix ? `--bb-${prefix}${newPath.join('-')}` : `--bb-${newPath.join('-')}`;
      result[tokenName] = value.value;
    } else if (value && typeof value === 'object') {
      // Recurse deeper
      Object.assign(result, flattenTokens(value, prefix, newPath));
    }
  }

  return result;
}

// Helper function to resolve token references
function resolveReferences(tokens) {
  const resolved = { ...tokens };
  let changed = true;

  while (changed) {
    changed = false;
    for (const [name, value] of Object.entries(resolved)) {
      if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
        // This has a reference to resolve
        const newValue = value.replace(/\{([^}]+)\}/g, (match, ref) => {
          const refName = `--bb-${ref.replace(/\./g, '-')}`;
          if (resolved[refName]) {
            changed = true;
            return `var(${refName})`;
          }
          return match; // Keep unresolved references as-is
        });
        resolved[name] = newValue;
      }
    }
  }

  return resolved;
}

// Generate CSS from tokens
function generateCSS(tokens, selector = ':root') {
  const lines = [`${selector} {`];

  for (const [name, value] of Object.entries(tokens)) {
    lines.push(`  ${name}: ${value};`);
  }

  lines.push('}');
  return lines.join('\n');
}

// Extract light theme primitives
const lightPrimitiveTokens = flattenTokens(tokens['Primitives/Light'] || {});

// Extract dark theme primitives
const darkPrimitiveTokens = flattenTokens(tokens['Primitives/Dark'] || {});

// Extract aliases (theme-agnostic)
const aliasTokens = flattenTokens(tokens['Alias'] || {});

// Extract semantic tokens (from Semantic/light - assuming same structure for dark)
const semanticTokens = flattenTokens(tokens['Semantic/light'] || {});

// Resolve all references for light theme
const resolvedLightPrimitives = resolveReferences(lightPrimitiveTokens);
const resolvedLightAliases = resolveReferences({ ...lightPrimitiveTokens, ...aliasTokens });
const resolvedLightSemantic = resolveReferences({ ...lightPrimitiveTokens, ...aliasTokens, ...semanticTokens });

// Resolve all references for dark theme
const resolvedDarkPrimitives = resolveReferences(darkPrimitiveTokens);
const resolvedDarkAliases = resolveReferences({ ...darkPrimitiveTokens, ...aliasTokens });
const resolvedDarkSemantic = resolveReferences({ ...darkPrimitiveTokens, ...aliasTokens, ...semanticTokens });

// Generate CSS files with both light and dark themes
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Write primitives.css with both themes
const primitivesCSS = [
  generateCSS(resolvedLightPrimitives, ':root'),
  '',
  generateCSS(resolvedDarkPrimitives, '[data-theme="dark"]')
].join('\n');

fs.writeFileSync(
  path.join(buildDir, 'primitives.css'),
  primitivesCSS
);

// Write alias.css (only alias tokens, with both themes)
const lightAliasOnly = {};
const darkAliasOnly = {};

for (const [name, value] of Object.entries(resolvedLightAliases)) {
  if (name in aliasTokens) {
    lightAliasOnly[name] = value;
  }
}

for (const [name, value] of Object.entries(resolvedDarkAliases)) {
  if (name in aliasTokens) {
    darkAliasOnly[name] = value;
  }
}

const aliasCSS = [
  generateCSS(lightAliasOnly, ':root'),
  '',
  generateCSS(darkAliasOnly, '[data-theme="dark"]')
].join('\n');

fs.writeFileSync(
  path.join(buildDir, 'alias.css'),
  aliasCSS
);

// Write semantic.css (only semantic tokens, with both themes)
const lightSemanticOnly = {};
const darkSemanticOnly = {};

for (const [name, value] of Object.entries(resolvedLightSemantic)) {
  if (name in semanticTokens) {
    lightSemanticOnly[name] = value;
  }
}

for (const [name, value] of Object.entries(resolvedDarkSemantic)) {
  if (name in semanticTokens) {
    darkSemanticOnly[name] = value;
  }
}

const semanticCSS = [
  generateCSS(lightSemanticOnly, ':root'),
  '',
  generateCSS(darkSemanticOnly, '[data-theme="dark"]')
].join('\n');

fs.writeFileSync(
  path.join(buildDir, 'semantic.css'),
  semanticCSS
);

// Process component tokens (SM, MD, LG, XL)
const componentTokens = {};
['SM', 'MD', 'LG', 'XL'].forEach(size => {
  const sizeKey = `Components/${size}`;
  if (tokens[sizeKey]) {
    componentTokens[size] = {};
    Object.keys(tokens[sizeKey]).forEach(component => {
      const componentName = component.toLowerCase();
      const prefix = `component-${size.toLowerCase()}-${componentName}-`;
      componentTokens[size][componentName] = flattenTokens(tokens[sizeKey][component], prefix);
    });
  }
});

// Generate component CSS with resolved references
const componentTokensFlat = {};
Object.keys(componentTokens).forEach(size => {
  Object.keys(componentTokens[size]).forEach(component => {
    Object.assign(componentTokensFlat, componentTokens[size][component]);
  });
});

const resolvedComponents = resolveReferences({
  ...resolvedLightPrimitives,
  ...resolvedLightAliases,
  ...resolvedLightSemantic,
  ...componentTokensFlat
});

// Extract only component tokens for CSS output and add clamp values for responsive sizing
const componentOnly = {};
const sizeMap = { sm: 0.8, md: 1, lg: 1.2, xl: 1.5 }; // Scale factors

for (const [name, value] of Object.entries(resolvedComponents)) {
  if (name.includes('component') && name.includes('button')) {
    // For button padding tokens, create clamp values
    if (name.includes('Padding') && !name.includes('Full')) {
      const size = name.match(/component-(\w+)-/)?.[1];
      const scale = sizeMap[size] || 1;
      const isVertical = name.includes('V-Padding');

      if (isVertical) {
        // Vertical padding: smaller range
        const min = Math.max(0.125, scale * 0.25);
        const preferred = `${scale}vw`;
        const max = scale * 0.75;
        componentOnly[name] = `clamp(${min}rem, ${preferred}, ${max}rem)`;
      } else {
        // Horizontal padding: larger range
        const min = Math.max(0.25, scale * 0.5);
        const preferred = `${scale * 1.5}vw`;
        const max = scale * 1.25;
        componentOnly[name] = `clamp(${min}rem, ${preferred}, ${max}rem)`;
      }
    } else {
      // Keep other tokens as-is (spacing, radius, etc.)
      componentOnly[name] = value;
    }
  } else if (name.includes('component')) {
    // Non-button components keep original values
    componentOnly[name] = value;
  }
}

const componentCSS = generateCSS(componentOnly, ':root');

fs.writeFileSync(
  path.join(buildDir, 'components.css'),
  componentCSS
);

console.log('✅ Token CSS files generated successfully with light/dark themes:');
console.log('   - build/primitives.css');
console.log('   - build/alias.css');
console.log('   - build/semantic.css');
console.log('   - build/components.css');