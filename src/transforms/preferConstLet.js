const prism = require('@prism/selector');
const t = require('@babel/types');

function transformer(ast, state) {
  const root = prism(ast);
  let mutations = 0;

  root.find(t.variableDeclaration, {
    kind: 'var',
  })
  .forEach(path => {
    if (path.node.declarations.length !== 1) {
      return;
    }

    const variable = path.node.declarations[0].id.name;

    let assignmentCount = 0;
    
    assignmentCount += root.find(t.assignmentExpression, {
      left: {
        name: variable
      }
    })
    .filter(p => p.scope === path.scope)
    .size();

    assignmentCount += root.find(t.updateExpression, {
      argument: {
        name: variable
      }
    }).filter(p => p.scope === path.scope)
    .size();

    if (assignmentCount === 0 && path.node.declarations[0].init != null) {
      path.node.kind = 'const';
    } else {
      path.node.kind = 'let';
    }

    mutations++;
  });

  return mutations;
}

module.exports = transformer;
