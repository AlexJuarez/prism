const prettier = require('prettier');

function format(code) {
  return prettier.format(code, { parser: 'typescript', singleQuote: true });
}

module.exports = format;
