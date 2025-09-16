#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to read JSON file safely
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return {};
  }
}

// Merge tokens from tokens-import into main tokens.json
function mergeTokens() {
  const tokensImportDir = path.join(__dirname, '../tokens-import');
  const mainTokensPath = path.join(__dirname, '../tokens/tokens.json');

  // Start with current tokens.json as base
  let mergedTokens = readJsonFile(mainTokensPath);

  // Read primitives (Light and Dark)
  const lightPrimitives = readJsonFile(path.join(tokensImportDir, 'Primitives/Light.json'));
  const darkPrimitives = readJsonFile(path.join(tokensImportDir, 'Primitives/Dark.json'));

  // Read aliases
  const aliases = readJsonFile(path.join(tokensImportDir, 'Alias.json'));

  // Read semantic tokens
  const lightSemantic = readJsonFile(path.join(tokensImportDir, 'Semantic/light.json'));
  const darkSemantic = readJsonFile(path.join(tokensImportDir, 'Semantic/dark.json'));

  // Read component tokens
  const componentSM = readJsonFile(path.join(tokensImportDir, 'Components/SM.json'));
  const componentMD = readJsonFile(path.join(tokensImportDir, 'Components/MD.json'));
  const componentLG = readJsonFile(path.join(tokensImportDir, 'Components/LG.json'));
  const componentXL = readJsonFile(path.join(tokensImportDir, 'Components/XL.json'));

  // Read responsive tokens
  const fluidTokens = readJsonFile(path.join(tokensImportDir, 'Responsive/fluid.json'));

  // Merge into the expected structure
  mergedTokens = {
    'Primitives/Light': lightPrimitives,
    'Primitives/Dark': darkPrimitives,
    'Alias': aliases,
    'Semantic/light': lightSemantic,
    'Semantic/dark': darkSemantic,
    'Components/SM': componentSM,
    'Components/MD': componentMD,
    'Components/LG': componentLG,
    'Components/XL': componentXL,
    'Responsive/fluid': fluidTokens
  };

  // Write merged tokens back to main file
  fs.writeFileSync(mainTokensPath, JSON.stringify(mergedTokens, null, 2));
  console.log('✅ Tokens merged successfully from tokens-import to tokens/tokens.json');
}

// Run the merge
mergeTokens();