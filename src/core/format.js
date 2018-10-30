const prettier = require('prettier');

function format(code) {
  return prettier.format(code, { parser: 'typescript' });
}

module.exports = format;
