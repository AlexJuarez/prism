const { run } = require('./src');
const preferArrowFn = require('./src/transforms/preferArrowFn');
const preferConstLet = require('./src/transforms/preferConstLet');

// run(path.join(__dirname, 'src/transforms/__fixtures__/test.input.js'), [testTransform], { dryRun: true });
run('~/projects/dle-course-assembly/app/**/*.ts', [preferArrowFn, preferConstLet], { dryRun: false, summary: false });
