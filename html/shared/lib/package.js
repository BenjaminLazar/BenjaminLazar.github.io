#!/usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2));
const packager = require('anthill-exporter');
const timestamp = new Date().toISOString();
const config = {
  path: './',
  output: './exports',
  dot: true,
  dest: timestamp,
  ignore: ['node_modules', 'exports', '.DS_Store', '.git', 'package-lock.json'] // excludes the folders
};

if (argv._[0]) {
  config.dest = argv._[0];
}

// 'shared' prop declares folder to exclude, in this case 'node_modules'.
packager('.', config)
  .then((result) => {
    console.log('Shared folder exported to', result);
  })
  .catch((err) => {
    console.error('Not able to package shared', err);
  });
