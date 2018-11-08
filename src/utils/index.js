const t = require('@babel/types');
const createNode = require('./createNode');

function capitalize(str) {
  return `${str.substr(0, 1).toUpperCase()}${str.substr(1)}`;
}

function createClass(name, body, decorators) {
  return t.classDeclaration(t.identifier(name), null, t.classBody(body), decorators);
}

function createDecorator(name, args = []) {
  return t.decorator(t.callExpression(t.identifier(name), args));
}

function createClassMethod(name, params = [], body) {
  return t.classMethod('method', t.identifier(name), params, body);
}

function createMemberExpression(props) {
  const queue = [...props];

  queue.reverse();

  let curr = t.identifier(queue.pop());

  while (queue.length) {
    const temp = t.identifier(queue.pop());

    curr = t.memberExpression(curr, temp);
  }

  return curr;
}

function createCallExpression(props, params = []) {
  return t.callExpression(createMemberExpression(props), params);
}

function createConstructor(paramNames) {
  return t.classMethod(
    'constructor',
    t.identifier('constructor'),
    paramNames.map(name => {
      const param = t.identifier(name);
      param.decorators = [createDecorator('Inject', [t.stringLiteral(name)])];
      return param;
    }),
    t.blockStatement([]),
  );
}

function createSpecificImport(names, from) {
  return t.importDeclaration(
    names.map(name => {
      const id = t.identifier(name);
      return t.importSpecifier(id, id)
    }),
    t.stringLiteral(from),
  );
}

module.exports = {
  capitalize,
  createClass,
  createClassMethod,
  createCallExpression,
  createMemberExpression,
  createDecorator,
  createConstructor,
  createSpecificImport,
  createNode,
};
