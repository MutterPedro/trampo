import { ICronJob, IOneTimeJob } from '../models/ITrampoConfiguration';

export default abstract class Scheduler<T = IOneTimeJob | ICronJob> {
  public abstract running: boolean;
  public constructor(protected readonly config: T) {}

  public abstract start(): Promise<void>;
  public abstract stop(): Promise<void>;
}
