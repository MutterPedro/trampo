#!/usr/bin/env node
import commander from 'commander';

import { description, version } from '../package.json';
import { run } from './jobs';

const program = commander
  .version(version)
  .description(description)
  .option('-F, --file <path-to-file>', 'file containing the information to run the jobs')
  .parse(process.argv);

if (!program.file) {
  program.outputHelp();
} else {
  run(program.file);
}
