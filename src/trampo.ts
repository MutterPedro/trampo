import commander from 'commander';

import { description, version } from '../package.json';

commander
  .version(version)
  .description(description)
  .option('-F, --file <path-to-file>', 'file containing the information to run the jobs')
  .parse(process.argv);
