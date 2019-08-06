/* tslint:disable:no-unused-expression */
import { exec } from 'child_process';
import fs from 'fs';

import { expect } from 'chai';

import { description, name, version } from '../package.json';
import { TrampoJob } from '../src/models/ITrampoConfiguration';

const indexPath = './src/trampo.ts';

describe('INDEX', () => {
  const timeout = 5000;

  describe('smoke tests', () => {
    context('package.json attributes', () => {
      it('should exist', () => {
        expect(description).to.exist;
        expect(name).to.exist;
        expect(version).to.exist;
      });
    });
  });

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

    it('should return the project usage given no arguments', done => {
      exec(`ts-node ${indexPath}`, (err, stdout) => {
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

  describe('integration tests', () => {
    it('should run some jobs with a config json file successfully', done => {
      const config: TrampoJob = [
        {
          when: timeout,
          exec: 'echo "Hello Test!"',
          name: 'One time job',
        },
      ];
      const path = './temp.json';

      fs.writeFile(path, JSON.stringify(config), err => {
        if (err) {
          throw err;
        }

        exec(`ts-node ${indexPath} -F ${path}`, (err2, stdout) => {
          if (err2) {
            throw err2;
          }

          expect(stdout.trim()).to.contain('One time job started');

          fs.unlink(path, err3 => {
            if (err3) {
              throw err3;
            }
          });

          done();
        });
      });
      // tslint:disable-next-line:no-magic-numbers
    }).timeout(timeout * 10);
  });
});
