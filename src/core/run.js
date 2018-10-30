const glob = require('glob');
const Harness = require('./Harness');

function run(pattern, transforms, opts = {}) {
  const files = glob.sync(pattern.replace(/^~/, process.env.HOME), { nodir: true, absolute: true });

  const state = {};

  files.forEach(fp => {
    const harness = new Harness({ filePath: fp, dryRun: opts.dryRun });
    harness.run(transforms, state);
  });
}

module.exports = run;
