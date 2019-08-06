import { TrampoJob } from '../models/ITrampoConfiguration';
import { readFile } from '../utils/file';
import logger from '../utils/logger';
import { getConfigFromJSONFile } from '../utils/parser';
import { isOneTimeJob } from '../utils/typeGuard';
import CronJobScheduler from './CronJobScheduler';
import OneTimeJobScheduler from './OneTimeJobScheduler';
import Scheduler from './Scheduler';

export function getSchedulerInstances(configs: TrampoJob): Scheduler[] {
  return configs.map(config => (isOneTimeJob(config) ? new OneTimeJobScheduler(config) : new CronJobScheduler(config)));
}

export function run(filePath: string): void {
  const buffer = readFile(filePath);
  const configs = getConfigFromJSONFile(buffer);
  const schedulers = getSchedulerInstances(configs.jobs);

  schedulers.forEach(scheduler => {
    scheduler.start().catch(logger.error);
  });
}
