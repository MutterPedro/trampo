/* tslint:disable:no-unused-expression */
import chai, { expect } from 'chai';
import * as faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chalk from 'chalk';

import { getSchedulerInstances } from '../src/jobs';
import CronJobScheduler from '../src/jobs/CronJobScheduler';
import OneTimeJobScheduler from '../src/jobs/OneTimeJobScheduler';
import { ICronJob, IOneTimeJob } from '../src/models/ITrampoConfiguration';
import logger from '../src/utils/logger';

chai.use(sinonChai);
describe('INDEX', () => {
  const timeout = 5000;
  describe('smoke tests', () => {
    context('getSchedulerInstances', () => {
      it('should exists', () => {
        expect(getSchedulerInstances).to.exist;
      });

      it('should be a function', () => {
        expect(getSchedulerInstances).to.be.a('function');
      });
    });

    context('CronJobScheduler', () => {
      it('should exists', () => {
        expect(CronJobScheduler).to.exist;
      });

      it('should be a class', () => {
        const config: ICronJob = { name: faker.lorem.word(), exec: 'ls', period: '* * * * *' };
        expect(new CronJobScheduler(config)).to.instanceOf(CronJobScheduler);
      });
    });

    context('OneTimeJobScheduler', () => {
      it('should exists', () => {
        expect(OneTimeJobScheduler).to.exist;
      });

      it('should be a class', () => {
        const config: IOneTimeJob = { name: faker.lorem.word(), exec: 'ls', when: Date.now() };
        expect(new OneTimeJobScheduler(config)).to.instanceOf(OneTimeJobScheduler);
      });
    });
  });

  describe('unit tests', () => {
    let loggerStub: sinon.SinonStub;

    beforeEach(() => {
      loggerStub = sinon.stub(logger, 'info');
    });

    afterEach(() => {
      loggerStub.restore();
    });

    context('getSchedulerInstances', () => {
      it('should return empty array', () => {
        expect(getSchedulerInstances([])).to.be.an('array').that.is.empty;
      });

      it('should return an array with one time job scheduler', () => {
        const config: IOneTimeJob = { name: faker.lorem.word(), exec: 'ls', when: Date.now() };

        const schedulers = getSchedulerInstances([config]);

        expect(schedulers).to.be.an('array');
        expect(schedulers.length).to.be.eq(1);
        expect(schedulers[0]).to.be.instanceOf(OneTimeJobScheduler);
      });

      it('should return an array with cron job scheduler', () => {
        const config: ICronJob = { name: faker.lorem.word(), exec: 'ls', period: '* * * * *' };

        const schedulers = getSchedulerInstances([config]);

        expect(schedulers).to.be.an('array');
        expect(schedulers.length).to.be.eq(1);
        expect(schedulers[0]).to.be.instanceOf(CronJobScheduler);
      });
    });

    context('CronJobScheduler', () => {
      let instance: CronJobScheduler;
      let name: string = '';

      beforeEach(() => {
        name = faker.lorem.word();
        const config: ICronJob = { name, exec: 'ls', period: '0 * * * *' };
        instance = new CronJobScheduler(config);
      });

      it('should implement scheduler methods', () => {
        expect(instance.start).to.exist;
        expect(instance.start).to.be.a('function');
        expect(instance.stop).to.exist;
        expect(instance.stop).to.be.a('function');
      });

      it('should start the job', async () => {
        expect(instance.start.bind(instance)).to.not.throw();

        await instance.start();

        expect(instance.running).to.be.true;
        expect(loggerStub).to.have.been.calledTwice;
        expect(loggerStub).to.have.been.calledWith(
          `Cron job ${chalk.magentaBright(name)} started. Running in a period of 0 * * * *`,
        );
      }).timeout(timeout);

      it('should stop the job ', async () => {
        expect(instance.stop.bind(instance)).to.not.throw();

        await instance.stop();

        expect(instance.running).to.be.false;
        expect(loggerStub).to.have.been.calledTwice;
        expect(loggerStub).to.have.been.calledWith(
          `Cron job ${chalk.magentaBright(name)} stopped. Running in a period of 0 * * * *`,
        );
      }).timeout(timeout);
    });

    context('OneTimeJobScheduler', () => {
      const daysMillisecond = 172800000;
      let instance: OneTimeJobScheduler;
      let setTimeoutStub: sinon.SinonStub;
      let clearTimeoutStub: sinon.SinonStub;
      let name: string = '';

      beforeEach(() => {
        name = faker.lorem.word();
        const config: IOneTimeJob = { name, when: daysMillisecond, exec: 'ls' };
        instance = new OneTimeJobScheduler(config);
        setTimeoutStub = sinon.stub(global, 'setTimeout');
        setTimeoutStub.returns(faker.random.number());

        clearTimeoutStub = sinon.stub(global, 'clearTimeout');
      });

      afterEach(() => {
        setTimeoutStub.restore();
        clearTimeoutStub.restore();
      });

      it('should implement scheduler methods', () => {
        expect(instance.start).to.exist;
        expect(instance.start).to.be.a('function');
        expect(instance.stop).to.exist;
        expect(instance.stop).to.be.a('function');
      });

      it('should start the job', async () => {
        expect(instance.start.bind(instance)).to.not.throw();

        await instance.start();

        expect(instance.running).to.be.true;
        expect(setTimeoutStub).to.have.been.calledTwice;
        expect(loggerStub).to.have.been.calledThrice;
        expect(loggerStub).to.have.been.calledWith(
          `One time job ${chalk.magentaBright(name)} started. It will run at ${new Date(
            Date.now() + daysMillisecond,
          ).toLocaleDateString()}`,
        );
      }).timeout(timeout);

      it('should stop the job ', async () => {
        expect(instance.stop.bind(instance)).to.not.throw();

        await instance.start();
        await instance.stop();

        expect(instance.running).to.be.false;
        expect(clearTimeoutStub).to.have.been.calledOnce;
      }).timeout(timeout);
    });
  });
});
