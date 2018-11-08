const fs = require('fs');
const recast = require('recast');
const parser = require('./parser');

class File {
  constructor(options = {}) {
    this.source = options.source;
    this.path = options.filePath;
    this.parser = options.parser || parser;

    this.read();

    this.ast = recast.parse(this.source, { parser });
  }

  read() {
    if (this.path == null || this.source != null) {
      return;
    }

    this.source = fs.readFileSync(this.path).toString();
  }

  toString() {
    try {
      const { code } = recast.print(this.ast, { quote: 'single' });

      return code;
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  write() {
    let code = this.toString();

    if (code == null) {
      return;
    }

    fs.writeFileSync(this.path, code, 'utf8');
  }
}

module.exports = File;
