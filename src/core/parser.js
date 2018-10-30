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

  return parser.parse(code, { plugins, sourceType: 'module', ...options });
}

module.exports = { parse };
