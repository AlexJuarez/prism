const Path = require('./Path');

function capitalize(str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`;
}

function isObject(o) {
  return o != null && typeof o === 'object' && !Array.isArray(o);
}

function isNode(o) {
  return isObject(o) && o.type != null;
}

function matches(a, b) {
  if (typeof b === 'function') {
    return b(a);
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (Array.isArray(b)) {
    const unmatched = [...a];

    return b.every(e => {      
      for (let i = 0; i < unmatched.length; i++) {
        const d = unmatched[i];
        if (matches(d, e)) {
          unmatched.splice(i, 1);

          return true
        }
      }

      return false;
    });
  }

  if (isNode(a) && isObject(b)) {
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
      const child = node[key];

      if (Array.isArray(child)) {
        child.forEach(e => {
          if (isNode(e)) {
            queue.push(new Path(e, path, key));
          }
        });

        return;
      }

      if (!isNode(child)) {
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
