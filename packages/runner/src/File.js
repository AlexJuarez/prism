const fs = require('fs');
const generate = require('@babel/generator').default;
const format = require('./format');
const parser = require('./parser');


class File {
  constructor(options = {}) {
    this.source = options.source;
    this.path = options.filePath;
    this.parser = options.parser || parser;

    this.read();

    this.ast = this.parser.parse(this.source);
  }

  read() {
    if (this.path == null || this.source != null) {
      return;
    }

    this.source = fs.readFileSync(this.path).toString();
  }

  toString() {
    try {
      const { code } = generate(
        this.ast,
        { retainLines: true, retainFunctionParens: true, compact: false },
        this.source,
      );

      return code;
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  write(prettify = true) {
    let code = this.toString();

    if (code == null) {
      return;
    }

    if (prettify) {
      code = format(code);
    }

    fs.writeFileSync(this.path, code, 'utf8');
  }
}

module.exports = File;
