/* tslint:disable:no-unused-expression */
import axios from 'axios';
import chai, { expect } from 'chai';
import * as faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { ICronJob, IOneTimeJob } from '../src/models/ITrampoConfiguration';
import logger from '../src/utils/logger';
import { getActionFunction, getConfigFromJSONFile } from '../src/utils/parser';

chai.use(sinonChai);

describe('PARSER', () => {
  describe('smoke tests', () => {
    context('getConfigFromJSONFile', () => {
      it('should exists', () => {
        expect(getConfigFromJSONFile).to.exist;
      });

      it('should be a function', () => {
        expect(getConfigFromJSONFile).to.be.a('function');
      });
    });

    context('getActionFunction', () => {
      it('should exists', () => {
        expect(getActionFunction).to.exist;
      });

      it('should be a function', () => {
        expect(getActionFunction).to.be.a('function');
      });
    });
  });

  describe('unit tests', () => {
    const timeout = 5000;

    context('getConfigFromJSONFile', () => {
      let loggerErrorStub: sinon.SinonStub;
      beforeEach(() => {
        loggerErrorStub = sinon.stub(logger, 'error');
      });

      afterEach(() => {
        loggerErrorStub.restore();
      });

      it('should return an object', () => {
        const config = getConfigFromJSONFile(Buffer.from(JSON.stringify({})));

        expect(config).to.be.an('object');
      });

      it('should throws syntax error [not valid json file]', () => {
        expect(() => getConfigFromJSONFile(Buffer.from(faker.random.alphaNumeric(1)))).to.throw;
      });

      it('should return a default config object', () => {
        const defaultConfig = { jobs: [] };

        const config = getConfigFromJSONFile(Buffer.from(JSON.stringify({})));
        expect(config).to.be.deep.eq(defaultConfig);
        expect(loggerErrorStub).to.have.been.calledOnce;
      });

      it('should return a default config object too', () => {
        const defaultConfig = { jobs: [] };
        const buffer = Buffer.from(JSON.stringify(faker.helpers.userCard()));

        const config = getConfigFromJSONFile(buffer);
        expect(config).to.be.deep.eq(defaultConfig);
        expect(loggerErrorStub).to.have.been.calledOnce;
      });

      it('should return a single job configuration', () => {
        const name = faker.lorem.sentence();
        const json: ICronJob = { name, period: '* * * * *', exec: 'echo "Hello"', httpRequest: undefined };
        const buffer = Buffer.from(JSON.stringify(json));

        const expectedConfig = { jobs: [json] };
        const config = getConfigFromJSONFile(buffer);
        expect(config).to.be.deep.eq(expectedConfig);
      });

      it('should return a multi job configuration', () => {
        const name = faker.lorem.sentence();
        const cronJob: ICronJob = { name, period: '* * * * *', exec: 'echo "Hello"', httpRequest: undefined };
        const oneTimeJob: IOneTimeJob = { name, when: Date.now(), exec: 'echo "Hello"', httpRequest: undefined };
        const buffer = Buffer.from(JSON.stringify([cronJob, oneTimeJob]));

        const expectedConfig = { jobs: [cronJob, oneTimeJob] };
        const config = getConfigFromJSONFile(buffer);
        expect(config).to.be.deep.eq(expectedConfig);
      });

      it('should complain about wrong type config', () => {
        const name = faker.lorem.sentence();

        const cronJob = { name, period: faker.random.uuid(), exec: 'echo "Hello"' };
        const oneTimeJob = { name, when: Date.now(), exec: faker.random.number() };

        const buffer = Buffer.from(JSON.stringify([cronJob, oneTimeJob]));
        getConfigFromJSONFile(buffer);
        expect(loggerErrorStub).to.have.been.calledTwice;
      });
    });

    context('getActionFunction', () => {
      it('should return undefined', async () => {
        // @ts-ignore
        expect(await getActionFunction({})()).to.be.undefined;
      });

      it('should return a function to execute a terminal command', done => {
        const job: ICronJob = {
          name: faker.lorem.word(),
          period: '* * * * *',
          exec: 'echo "Hello"',
          httpRequest: undefined,
        };

        const func = getActionFunction(job, (err, stdout) => {
          expect(err).to.be.null;
          expect(stdout).to.contain('Hello');

          done();
        });

        expect(func).to.be.a('function');
        func();
      }).timeout(timeout);

      it('should return a function to execute a http request', done => {
        const stub = sinon.stub(axios, 'request');
        stub.resolves(true);

        const job: ICronJob = {
          name: faker.lorem.word(),
          period: '* * * * *',
          httpRequest: {
            body: {},
            headers: {},
            method: 'POST',
            url: faker.internet.url(),
          },
        };

        const func = getActionFunction(job, result => {
          expect(result).to.be.true;
          expect(stub).to.be.calledOnce;

          stub.restore();
          done();
        });

        expect(func).to.be.a('function');
        func();
      }).timeout(timeout);
    });
  });
});
