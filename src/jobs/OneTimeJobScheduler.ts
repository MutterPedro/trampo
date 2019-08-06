import { IOneTimeJob } from '../models/ITrampoConfiguration';
import Scheduler from './Scheduler';

export default class OneTimeJobScheduler extends Scheduler<IOneTimeJob> {
  public running: boolean = false;

  public async start(): Promise<void> {
    return undefined;
  }

  public async stop(): Promise<void> {
    return undefined;
  }
}
