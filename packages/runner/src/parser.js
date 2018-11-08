const parser = require('@babel/parser');

function parse(code, options = {}) {
  const plugins = [
    ['typescript', { allExtensions: true }],
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'decorators-legacy',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'objectRestSpread',
    'functionBind',
  ];

  return parser.parse(code, { plugins, startLine: 1, tokens: true, sourceMaps: 'inline', sourceType: 'module', ranges: true, ...options });
}

module.exports = { parse };
