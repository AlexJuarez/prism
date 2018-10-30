const fs = require('fs');
const path = require('path');
const parser = require('../core/parser');
const t = require('@babel/types');

const source = require('./codemod');

describe('walk', () => {
  let ast;

  beforeEach(() => {
    ast = parser.parse(fs.readFileSync(path.join(__dirname, 'codemod.js'), 'utf8'));
  });

  test('find', () => {
    const root = source(ast);
    const nodes = root.find(t.identifier, { name: 'queue' });

    expect(nodes.size()).toEqual(5);
  });
});
