class Transformer {
  constructor(transforms = [], opts = {}) {
    this.options = { ...opts };
    this.mutations = 0;
    this.transforms = transforms;
  }

  execute(file, transform, state) {
    if (typeof transform !== 'function') {
      console.error(`Invalid transform for: ${file.path}`);
      return;
    }

    this.mutations += transform(file.ast, state);
  }

  apply(file, transforms, state) {
    if (!Array.isArray(transforms)) {
      console.error(`Invalid transforms for: ${file.filePath}`);
      return;
    }

    transforms.forEach(transform => this.execute(file, transform, state));
  }

  run(file, state) {
    this.apply(file, this.transforms, state);

    if (this.mutations === 0) {
      return;
    }
  }
}

module.exports = Transformer;
