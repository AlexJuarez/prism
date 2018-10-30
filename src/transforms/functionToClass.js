const codemod = require('../utils/codemod');
const t = require('@babel/types');

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
    names.map(name => t.importSpecifier(t.identifier(name), t.identifier(name))),
    t.stringLiteral(from),
  );
}

function transformer(ast, state) {
  const root = codemod(ast);
  const imports = [];

  let mutations = 0;

  mutations += root
    .find(t.functionDeclaration, {
      id: {
        name: name => name.indexOf('Factory') !== -1,
      },
    })
    .forEach(path => {
      const p = codemod(path.node.body);
      const methods = p
        .find(t.functionDeclaration)
        .map(d => {
          return createClassMethod(d.node.id.name, d.node.params, d.node.body);
        })
        .nodes();
      const oldName = path.node.id.name;

      const inject = [];

      root
        .find(t.AssignmentExpression, {
          left: {
            object: {
              name: name => name === oldName,
            },
            property: {
              name: '$inject',
            },
          },
        })
        .forEach(path => {
          inject.push(...path.node.right.elements.map(literal => literal.value));
        })
        .remove();

      p.find(t.identifier, {
        name: name => inject.indexOf(name) !== -1,
      }).forEach(path => {
        path.replace(t.memberExpression(t.identifier('this'), path.node));
      });

      methods.unshift(createConstructor(inject));

      const name = capitalize(oldName.replace('Factory', 'Service'));

      root.find(t.identifier, { name: oldName }).forEach(path => (path.node.name = name));

      const cls = createClass(name, methods, [createDecorator('Injectable')]);

      imports.push(createSpecificImport(['Injectable', 'Inject'], '@angular/core'));

      path.replace(cls);
    })
    .size();

  root.find(t.program).forEach(path => {
    path.node.body.unshift(...imports);
  });

  return mutations;
}

module.exports = transformer;
