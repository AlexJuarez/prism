const glob = require('glob');
const Harness = require('./Harness');
const findInjectors = require('./transforms/findInjectors');

function run(pattern, opts = {}) {
  const files = glob.sync(pattern.replace(/^~/, process.env.HOME), { nodir: true, absolute: true });

  const state = {};

  files.forEach(fp => {
    const harness = new Harness(fp, { dryRun: opts.dryRun });
    harness.run([findInjectors], state);
  });

  console.log(state);
}

module.exports = run;
