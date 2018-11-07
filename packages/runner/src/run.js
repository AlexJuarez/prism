const glob = require('glob');
const File = require('./File');
const Transformer = require('./Transformer');

function runInline(options, transform, state) {
  const file = new File(options);
  const transformer = new Transformer([transform]);

  transformer.run(file, state);

  return file.toString();
}

function run(pattern, transforms, opts = { dryRun: false, summary: false }) {
  const files = glob.sync(pattern.replace(/^~/, process.env.HOME), { nodir: true, absolute: true });

  const state = {};

  let changed = 0;

  files.forEach(fp => {
    const file = new File({ filePath: fp });
    const transformer = new Transformer(transforms);

    transformer.run(file, state);

    if (transformer.mutations === 0) {
      return;
    }

    changed++;

    if (opts.summary && opts.dryRun) {
      return;
    }

    if (opts.dryRun) {
      console.log(file.toString());
    } else {
      file.write(false);
    }
  });

  if (opts.dryRun) {
    console.log('Dry run mode, no changes saved.');
  }

  console.log(`Found: ${files.length} files`);
  console.log(`Modifying: ${changed} files`);
}

module.exports = {
  run,
  runInline,
};
