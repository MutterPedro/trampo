import chalk from 'chalk';

import { IOneTimeJob } from '../models/ITrampoConfiguration';
import logger from '../utils/logger';
import { getActionFunction } from '../utils/parser';
import Scheduler from './Scheduler';

export default class OneTimeJobScheduler extends Scheduler<IOneTimeJob> {
  public running: boolean = false;
  private timeout: NodeJS.Timeout | null = null;

  public async start(): Promise<void> {
    if (this.running) {
      await this.stop();
    }

    this.timeout = setTimeout(getActionFunction(this.config), Number(this.config.when));

    logger.info(
      `One time job ${chalk.magentaBright(this.config.name)} started. It will run at ${new Date(
        Date.now() + Number(this.config.when),
      ).toLocaleDateString()}`,
    );
    this.running = true;
  }

  public async stop(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    logger.info(`One time job ${chalk.magentaBright(this.config.name)} stopped`);
    this.running = false;
  }
}
