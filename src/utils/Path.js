class Path {
  constructor(node, parent = null, key = null) {
    this.node = node;
    this.parent = parent;
    this.key = key;
  }

  replace(node) {
    node.leadingComments = [...(this.node.leadingComments || [])];
    node.trailingComments = [...(this.node.trailingComments || [])];
    node.loc = {
      start: this.node.loc.start,
      end: this.node.loc.end,
    };

    if (Array.isArray(this.parent.node[this.key])) {
      const idx = this.parent.node[this.key].indexOf(this.node);

      this.node = node;
      this.parent.node[this.key][idx] = this.node;
    } else {
      this.node = node;
      this.parent.node[this.key] = this.node;
    }
  }

  prune() {
    this.parent.leadingComments.push(...(this.node.leadingComments || []));
    this.parent.trailingComments.push(...(this.node.trailingComments || []));

    delete this.parent.node[this.key];

    this.parent = null;
    this.key = null;
  }
}

module.exports = Path;
