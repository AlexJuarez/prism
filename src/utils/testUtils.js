const fs = require('fs');
const path = require('path');
const Harness = require('../core/Harness');

function runInlineTest(module, options, input, expectedOutput) {
  const transform = module.default ? module.default : module;
  const harness = new Harness(input);

  const state = {};

  harness.execute(transform, state);
  const output = harness.print();

  expect((output || '').trim()).toEqual(expectedOutput.trim());
}

function runTest(
  dirName,
  transformName,
  options = {
    fixtureFolder: '__fixtures__',
    inputSuffix: '.input.js',
    outputSuffix: '.output.js',
  },
  testFilePrefix = transformName,
) {
  const fixtureDir = path.join(dirName, '..', '__fixtures__');
  const inputPath = path.join(fixtureDir, testFilePrefix + inputSuffix);
  const outputPath = path.join(fixtureDir, testFilePrefix, outputSuffix);
  const source = fs.readFileSync(inputPath, 'utf8');
  const expectedOutput = fs.readFileSync(outputPath, 'utf8');

  const module = require(path.join(dirName, '..', `${transformName}.js`));
  runInlineTest(
    module,
    options,
    {
      filePath: inputPath,
      source,
    },
    expectedOutput,
  );
}

function defineTest(dirname, transformName, options, testFilePrefix) {
  const testName = testFilePrefix ? `transforms correctly using "${testFilePrefix}" data` : 'transforms correctly';

  describe(transformName, () => {
    it(testName, () => {
      runTest(dirname, transformName, options, testFilePrefix);
    });
  });
}

function defineInlineTest(module, options, input, expectedOutput, testName) {
  it(testName || 'transforms correctly', () => {
    runInlineTest(
      module,
      options,
      {
        source: input,
      },
      expectedOutput,
    );
  });
}

module.exports = {
  runInlineTest,
  runTest,
  defineTest,
  defineInlineTest,
};
