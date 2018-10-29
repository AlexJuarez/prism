const fs = require('fs');

const generate = require('@babel/generator');

const parser = require('./parser');

class Harness {
  constructor(opts = {}) {
    const options = (this.options = { filePath: null, dryRun: false, source: null, parser, ...opts });
    this.mutations = 0;
    this.source = options.source;
    this.ast = null;
    this.parser = options.parser;

    if (options.filePath != null && options.source == null) {
      this.read(options.filePath);
    }

    if (this.source != null) {
      this.ast = this.parser.parse(this.source);
    }
  }

  execute(transform, state) {
    if (typeof transform !== 'function') {
      console.error(`Invalid transform for: ${this.filePath}`);
      return;
    }

    this.mutations += transform(this.ast, state);
  }

  apply(transforms, state) {
    if (!Array.isArray(transforms)) {
      console.error(`Invalid transforms for: ${this.filePath}`);
      return;
    }

    transforms.forEach(transform => this.execute(transform, state));
  }

  run(transforms, state) {
    this.apply(transforms, state);

    if (this.mutations === 0) {
      return;
    }

    this.write();
  }

  print() {
    try {
      const { code } = generate(this.ast, { retainLines: true, retainFunctionParens: true }, this.source);
      return code;
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  read(fp) {
    this.source = fs.readFileSync(fp).toString();
    this.ast = this.parser.parse(this.source);
  }

  write() {
    const code = this.print();

    if (this.options.dryRun) {
      console.log(code);
      return;
    }

    if (code != null) {
      fs.writeFileSync(fp, code, 'utf8');
    }
  }
}

module.exports = Harness;
