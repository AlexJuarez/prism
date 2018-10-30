const parser = require('@babel/parser');

function parse(code, options = {}) {
  const plugins = [
    'typescript',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    ['decorators', { decoratorsBeforeExport: true, legacy: true }],
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'objectRestSpread',
    'functionBind',
  ];

  return parser.parse(code, { plugins, sourceType: 'module', ...options });
}

module.exports = { parse };
