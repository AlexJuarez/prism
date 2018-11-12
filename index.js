const { run } = require('./src');
// const path = require('path');
// const preferArrowFn = require('./src/transforms/preferArrowFn');
// const preferConstLet = require('./src/transforms/preferConstLet');
const removeReferenceLine = require('./src/transforms/removeReferenceLines');

// run(path.join(__dirname, 'src/transforms/__fixtures__/preferArrowFn.input.js'), [preferArrowFn], { dryRun: true });
run('~/projects/dle-course-assembly/app/**/*.ts', [removeReferenceLine], { dryRun: false, summary: false });
