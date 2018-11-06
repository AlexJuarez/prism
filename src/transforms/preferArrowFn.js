const prism = require('@prism/selector');
const t = require('@babel/types');

function transformer(ast, state) {
  const root = prism(ast);
  let mutations = 0;

  root.find(t.functionExpression, {
    id: null
  }).forEach(path => {
    const thisCount = prism(path.node).find(t.thisExpression).size();

    if (thisCount !== 0) {
      return;
    }

    mutations++;

    path.replace(t.arrowFunctionExpression(path.node.params, path.node.body));
  });

  return mutations;
}

module.exports = transformer;
