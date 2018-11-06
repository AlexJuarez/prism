const glob = require('glob');
const File = require('./File');
const Transformer = require('./Transformer');

function runInline(options, transform, state) {
  const file = new File(options);
  const transformer = new Transformer([transform]);

  transformer.run(file, state);

  return file.toString();
}

function run(pattern, transforms, opts = { dryRun: false }) {
  const files = glob.sync(pattern.replace(/^~/, process.env.HOME), { nodir: true, absolute: true });

  const state = {};

  files.forEach(fp => {
    const file = new File({ filePath: fp });
    const transformer = new Transformer(transforms);

    transformer.run(file, state);

    if (opts.dryRun) {
      console.log(file.toString());
    } else {
      file.write();
    }
  });
}

module.exports = {
  run,
  runInline,
};
