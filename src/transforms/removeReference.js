const prism = require('@prism/selector');

function transformer(ast, state) {
  const root = prism(ast);
  let mutations = 0;

  mutations += root.find('CommentLine', {
    value: v => v.indexOf('<reference') !== -1,
  })
  .remove()
  .size();

  return mutations;
}

module.exports = transformer;
