const StyleDictionary = require('style-dictionary');
const { registerTransforms } = require('@tokens-studio/sd-transforms');

// Register Tokens Studio transforms
registerTransforms(StyleDictionary);

StyleDictionary.registerTransform({
  name: 'name/bb-prefix',
  type: 'name',
  transformer: (token) => {
    return 'bb-' + token.path.join('-');
  }
});

module.exports = {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/typography/fontWeight',
        'ts/resolveMath',
        'ts/size/css/letterspacing',
        'ts/typography/css/generic',
        'ts/typography/css/shorthand',
        'ts/border/css/shorthand',
        'ts/shadow/css/shorthand',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/bb-prefix'
      ],
      buildPath: 'build/',
      files: [
        {
          destination: 'primitives.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Primitives/Light'),
          options: {
            selector: ':root'
          }
        },
        {
          destination: 'alias.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Alias'),
          options: {
            selector: ':root'
          }
        },
        {
          destination: 'semantic.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Semantic/light'),
          options: {
            selector: ':root'
          }
        }
      ]
    }
  }
};