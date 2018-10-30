const { run } = require('./src');
const testTransform = require('./src/transforms/functionToClass');
const path = require('path');

run(path.join(__dirname, 'src/transforms/__fixtures__/test.input.js'), [testTransform], { dryRun: true });
// run('~/projects/dle-course-assembly/app/**/*.ts', [testTransform], { dryRun: true });
