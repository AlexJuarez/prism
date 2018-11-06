const fs = require('fs');
const path = require('path');
const { runInline } = require('./run');

function runInlineTest(module, options, input, expectedOutput) {
  const transform = module.default ? module.default : module;
  const state = {};

  const output = runInline(input, module, state);

  expect((output || '').trim()).toEqual(expectedOutput.trim());
}

function runTest(
  dirName,
  transformName,
  options = {
    fixtureFolder: '../__fixtures__',
    inputSuffix: '.input.js',
    outputSuffix: '.output.js',
  },
  testFilePrefix = transformName,
) {
  const { fixtureFolder, inputSuffix, outputSuffix } = options;
  const fixtureDir = path.join(dirName, fixtureFolder);
  const inputPath = path.join(fixtureDir, testFilePrefix + inputSuffix);
  const outputPath = path.join(fixtureDir, testFilePrefix + outputSuffix);
  const source = fs.readFileSync(inputPath, 'utf8').toString();
  const expectedOutput = fs.readFileSync(outputPath, 'utf8').toString();

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