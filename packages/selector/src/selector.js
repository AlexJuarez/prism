const Path = require('./Path');

function capitalize(str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`;
}

function matches(a, b) {
  if (typeof b === 'function') {
    return b(a);
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(b)) {
    const set = new Set(a);

    return b.every(e => set.has(e));
  }

  if (a != null && b != null && typeof a === 'object') {
    return Object.keys(b).every(key => matches(a[key], b[key]));
  }

  return a === b;
}

function find(ast, type, selectors) {
  if (typeof type === 'function') {
    type = type.name;
  }

  type = capitalize(type);

  const found = [];
  const queue = [new Path(ast)];

  while (queue.length) {
    const path = queue.pop();
    const { node } = path;

    Object.keys(node).forEach(key => {
      if (node[key] == null || node[key].type == null && !Array.isArray(node[key])) {
        return;
      }

      if (Array.isArray(node[key])) {
        node[key].forEach(e => {
          if (e != null && e.type != null) {
            queue.push(new Path(e, path, key));
          }
        });

        return;
      }

      queue.push(new Path(node[key], path, key));
    });

    if (node.type !== type) {
      continue;
    }

    if (matches(node, selectors)) {
      found.push(path);
    }
  }

  return found;
}

function closest(path, type, selectors) {
  if (typeof type === 'function') {
    type = type.name;
  }

  type = capitalize(type);

  const curr = path;

  while (curr.parent != null) {
    const { parent } = curr;

    if (parent.node.type === type && matches(parent.node, selectors)) {
      return path.parent;
    }

    curr = parent;
  }

  return null;
}

function forEach(nodes, fn) {
  nodes.forEach(path => {
    fn(path);
  });

  return source(nodes);
}

function replaceWith(nodes, fn) {
  nodes.forEach(path => {
    path.replace(fn(path));
  });

  return source(nodes);
}

function source(nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  return {
    find(type, selectors = {}) {
      const results = nodes.map(node => find(node, type, selectors));

      return source([].concat.apply([], results));
    },
    forEach(fn) {
      forEach(nodes, fn);

      return source(nodes);
    },
    replaceWith(fn) {
      replaceWith(nodes, fn);

      return source(nodes);
    },
    remove() {
      nodes.forEach(node => node.prune());

      return source(nodes);
    },
    filter(fn) {
      return source(nodes.filter(fn));
    },
    size() {
      return nodes.length;
    },
    closest(type, selectors) {
      return source(nodes.map(path => closest(path, type, selectors)));
    },
    nodes() {
      return nodes;
    },
    map(fn) {
      return source(nodes.map(fn));
    },
  };
}

module.exports = source;
