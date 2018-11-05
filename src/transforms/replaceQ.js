const codemod = require('../utils/codemod');
const t = require('@babel/types');
const utils = require('./utils');

function transformer(ast, state) {
  root = codemod(ast);
  let mutations = 0;

  root.find(t.stringLiteral, {
    value: '$q'
  }).remove();

  root.find(t.functionDeclaration)
    .forEach(path => {
      const idx = path.node.params.map(v => v.name).indexOf('$q');

      path.node.params.splice(idx, 1);
    });

  let includeDefer = false;
  
  mutations += root.find(t.callExpression, {
    callee: {
      object: {
        name: '$q'
      }
    }
  }).forEach(path => {
    const functionName = path.node.callee.property.name;

    switch (functionName) {
      case 'reject':
      case 'resolve':
      case 'all':
        path.node.callee.object = t.identifier('Promise');
        break;
      case 'when':
        path.replace(
          utils.createCallExpression(['Promise', 'resolve'])
        );
        break;
      case 'defer':
        path.replace(
          utils.createCallExpression(['deferPromise'])
        );
        includeDefer = true;
        break;
    }
  }).size();

  if (includeDefer) {
    root
      .find(t.program)
      .forEach(path => {
        path.node.body.unshift(utils.createSpecificImport(['deferPromise'], 'defer-promise'));
      });
  }


  return mutations;
}

module.exports = transformer;
