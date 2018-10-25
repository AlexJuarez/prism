const parser = require('@babel/parser');

function parse(code, options = {}) {
  const plugins = [
    'typescript',
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'decorators-legacy',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind'
  ];

  return parser.parse(code, { plugins, sourceType: 'module', ...options });
}

module.exports = { parse };
