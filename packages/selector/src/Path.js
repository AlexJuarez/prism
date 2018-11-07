class Path {
  constructor(node, parent = null, key = null) {
    this.node = node;
    this.parent = parent;
    this.key = key;

    let scope = this;

    while (scope.parent != null 
      && (scope.node.type != 'ArrowFunctionExpression'
      || scope.node.type != 'FunctionDeclaration'
      || scope.node.type != 'Program')) {
      scope = scope.parent;
    }

    this.scope = scope.node;
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
    if (this.parent.node.leadingComments == null) {
      this.parent.node.leadingComments = [];
    }

    if (this.parent.node.trailingComments == null) {
      this.parent.node.trailingComments = [];
    }

    this.parent.node.leadingComments.push(...(this.node.leadingComments || []));
    this.parent.node.trailingComments.push(...(this.node.trailingComments || []));
    
    if (Array.isArray(this.parent.node[this.key])) {
      const idx = this.parent.node[this.key].indexOf(this.node);

      this.parent.node[this.key].splice(idx, 1);
    } else {
      delete this.parent.node[this.key];
    }

    this.parent = null;
    this.key = null;
  }
}

module.exports = Path;
