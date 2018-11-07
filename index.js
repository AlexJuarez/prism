const { run } = require('./src');
const preferArrowFn = require('./src/transforms/preferArrowFn');

// run(path.join(__dirname, 'src/transforms/__fixtures__/test.input.js'), [testTransform], { dryRun: true });
run('~/projects/dle-course-assembly/app/**/*.ts', [preferArrowFn], { dryRun: true, summary: true });
