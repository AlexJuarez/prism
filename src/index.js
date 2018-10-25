const fs = require('fs');
const path = require('path');

const glob = require('glob');
const t = require('@babel/types');
const walk = require('babylon-walk');

const parser = require('./parser');

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

function transform(fp, state = {}) {
  const source = fs.readFileSync(fp, 'utf8');

  const ast = parser.parse(source);

  const visitors = {
    AssignmentExpression(node, state) {
      findInject(node, state);
    }
  };

  walk.simple(ast, visitors, state);

  console.log(state.graph);
}

function run(pattern) {
  const files = glob.sync(pattern, { nodir: true, absolute: true });

}
