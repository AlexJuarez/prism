const fs = require('fs');
const path = require('path');
const parser = require('../core/parser');
const t = require('@babel/types');

const source = require('./codemod');

describe('walk', () => {
  let ast;

  beforeEach(() => {
    ast = parser.parse(fs.readFileSync(path.join(__dirname, 'walk.js'), 'utf8'));
  });

  test('find', () => {
    const root = source(ast);
    const nodes = root.find(t.identifier, { name: 'function' });

    expect(nodes.size()).toEqual(1);
  });
});
