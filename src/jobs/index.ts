import { TrampoJob } from '../models/ITrampoConfiguration';
import { isOneTimeJob } from '../utils/typeGuard';
import CronJobScheduler from './CronJobScheduler';
import OneTimeJobScheduler from './OneTimeJobScheduler';
import Scheduler from './Scheduler';

export function getSchedulerInstances(configs: TrampoJob): Scheduler[] {
  return configs.map(config => (isOneTimeJob(config) ? new OneTimeJobScheduler(config) : new CronJobScheduler(config)));
}
