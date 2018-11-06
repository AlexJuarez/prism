const prism = require('@prism/selector');
const t = require('@babel/types');
const utils = require('../../utils');

function transformer(ast, state) {
  const root = prism(ast);
  let mutations = 0;

  root
    .find(t.AssignmentExpression, {
      left: {
        property: {
          name: '$inject'
        },
      },
      right: {
        elements: elems => elems.map(v => v.value).indexOf('$http') !== -1
      }
    })
    .forEach(path => {
      const { name } = path.node.left.object;
      
      prism(path.node).find(t.stringLiteral, {
        value: '$http'
      })
      .remove()
      .size();

      root
        .find(t.functionDeclaration, {
          id: {
            name
          }
        })
        .forEach(path => {
          const p = prism(path.node);

          mutations += p
            .find(t.callExpression, {
              callee: {
                object: {
                  name: '$http'
                }
              }
            })
            .forEach(path => {
              path.node.callee.object = utils.createMemberExpression(['this', 'http']);
            })
            .size();

          const idx = path.node.params.map(v => v.name).indexOf('$http');

          path.node.params.splice(idx, 1);
        });
    });

  

  return mutations;
}

module.exports = transformer;
