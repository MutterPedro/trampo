import { ICronJob, IOneTimeJob, ITrampoConfiguration } from '../models/ITrampoConfiguration';
import logger from './logger';
import { isCronJob, isOneTimeJob } from './typeGuard';

function parseObjectToConfig(object: Partial<ICronJob | IOneTimeJob>): ICronJob | IOneTimeJob | void {
  if (isOneTimeJob(object)) {
    return {
      when: object.when,
      exec: object.exec,
      httpRequest: object.httpRequest,
      name: object.name,
    };
  }

  if (isCronJob(object)) {
    return {
      period: object.period,
      exec: object.exec,
      httpRequest: object.httpRequest,
      name: object.name,
    };
  }

  logger.error(`Job "${object.name}" have an invalid configuration. Ignoring it...`);
  return;
}

export function getConfigFromJSONFile(file: Buffer): ITrampoConfiguration {
  const json = JSON.parse(file.toString());
  const jobs = Array.isArray(json) ? json.map(parseObjectToConfig) : [parseObjectToConfig(json)];

  const config: ITrampoConfiguration = {
    jobs: jobs.filter(Boolean) as Array<IOneTimeJob | ICronJob>,
  };

  return config;
}
