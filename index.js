const { run } = require('./src');
const path = require('path');
const preferArrowFn = require('./src/transforms/preferArrowFn');
const preferConstLet = require('./src/transforms/preferConstLet');

run(path.join(__dirname, 'src/transforms/__fixtures__/preferArrowFn.input.js'), [preferArrowFn], { dryRun: true });
// run('~/projects/dle-course-assembly/app/**/*.ts', [preferArrowFn, preferConstLet], { dryRun: true, summary: false });
