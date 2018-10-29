const walk = require('babylon-walk');
const t = require('@babel/types');

function capitalize(str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`;
}

function convertFactoryToService(node, state) {
  if (!t.isIdentifier(node.id) || node.id.name.indexOf('Factory') === -1) {
    return 0;
  }

  const name = t.identifier(capitalize(node.id.name.replace('Factory', 'Service')));

  const c = t.classDeclaration(name, null, t.classBody([]), [
    t.decorator(t.callExpression(t.identifier('Injectable'), [])),
  ]);

  console.log(node);

  node.replace(c);

  return 1;
}

function transformer(ast, state) {
  let mutations = 0;

  const visitors = {
    FunctionDeclaration(node, state) {
      mutations += convertFactoryToService(node, state);
    },
  };

  walk.simple(ast, visitors, state);

  return mutations;
}

module.exports = transformer;
