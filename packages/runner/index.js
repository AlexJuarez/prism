const { run, runInline } = require('./src/run');
const testUtils = require('./src/testUtils');
const parser = require('./src/parser');

module.exports = { run, runInline, parser, ...testUtils };
