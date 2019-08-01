import { exec } from 'child_process';

import { expect } from 'chai';

import { description, name, version } from '../package.json';

const indexPath = './src/trampo.ts';

describe('INDEX', () => {
  const timeout = 5000;

  describe('options', () => {
    it('"--version": should return the version of the project', done => {
      exec(`ts-node ${indexPath} --version`, (err, stdout) => {
        if (err) {
          throw err;
        }

        expect(stdout.trim()).to.be.equal(version);
        done();
      });
    }).timeout(timeout);

    it('"--help": should return the project usage', done => {
      exec(`ts-node ${indexPath} --help`, (err, stdout) => {
        if (err) {
          throw err;
        }

        expect(stdout.trim()).to.contain(description);
        expect(stdout.trim()).to.contain(name);
        expect(stdout.trim()).to.contain('-F, --file <path-to-file>');
        expect(stdout.trim()).to.contain('file containing the information to run the jobs');
        done();
      });
    }).timeout(timeout);
  });
});
