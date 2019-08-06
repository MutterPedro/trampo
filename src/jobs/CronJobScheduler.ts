import { CronJob } from 'cron';
import { ICronJob } from '../models/ITrampoConfiguration';
import logger from '../utils/logger';
import { getActionFunction } from '../utils/parser';
import Scheduler from './Scheduler';

export default class CronJobScheduler extends Scheduler<ICronJob> {
  public running: boolean = false;
  private readonly cron: CronJob;

  constructor(config: ICronJob) {
    super(config);

    this.cron = new CronJob(config.period, getActionFunction(config));
  }

  public async start(): Promise<void> {
    if (this.running) {
      await this.stop();
      this.running = false;
    }

    await this.cron.start();

    this.running = true;
    logger.info(`Cron job started. Running in a period of ${this.config.period}`);
  }

  public async stop(): Promise<void> {
    await this.cron.stop();

    this.running = false;
    logger.info(`Cron job stopped. Running in a period of ${this.config.period}`);
  }
}
