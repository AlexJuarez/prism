const fs = require('fs');

const generate = require('@babel/generator');

const parser = require('./parser');

class Harness {
  constructor(fp, opts = { dryRun: false }) {
    this.options = {...opts};
    this.filePath = fp;
    this.source = fs.readFileSync(fp).toString();
    this.ast = parser.parse(this.source);
    this.mutations = 0;
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
      const { code } = generate(ast, { retainLines: true, retainFunctionParens: true }, source);
      return code;
    } catch (err) {
      console.error(err);
    }
    
    return null;
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
