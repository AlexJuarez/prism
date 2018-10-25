const walk = require('babylon-walk');
const t = require('@babel/types');

function findInject(node, state) {
  if (!t.isMemberExpression(node.left)) {
    return;
  }

  if (!t.isIdentifier(node.left.property)) {
    return;
  }

  if (node.left.property.name !== '$inject') {
    return;
  }

  const arr = node.right.elements.map(e => e.value);

  arr.forEach(value => {
    if (!/^\$/.test(value)) {
      return;
    }

    if (state.graph[value] == null) {
      state.graph[value] = 0;
    }

    state.graph[value]++;
  });
}

function transformer(ast, state) {
  let mutations = 0;

  if (state.graph == null) {
    state.graph = {};
  }

  const visitors = {
    AssignmentExpression(node, state) {
      findInject(node, state);
    },
  };

  walk.simple(ast, visitors, state);

  return mutations;
}

module.exports = transformer;
