const t = require('@babel/types');
const { parser } = require('@prism/runner');
const prism = require('@prism/selector');

function clone(obj) {
  let output = obj;

  if (Array.isArray(obj)) {
    output = [...obj.map(d => clone(d))];
  } else if (typeof obj === 'object') {
    output = {};

    Object.keys(obj).forEach(key => {
      output[key] = clone(obj[key]);
    });
  }

  return output;
}

function stringToNode(input) {
  const ast = parser.parse(input);

  let result = [];

  prism(ast).find(t.program).forEach(path => {
    result.push(...path.node.body);
  });

  if (result.length === 1) {
    result = result[0];
  }
 
  return result;
}

const cache = {};

function createNode(input) {
  if (cache[input] == null) {
    cache[input] = stringToNode(input);
  }

  return clone(cache[input]);
}

module.exports = createNode;
