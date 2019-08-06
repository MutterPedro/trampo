import { exec } from 'child_process';

import axios from 'axios';

import { ICronJob, IOneTimeJob, ITrampoConfiguration, TrampoJob } from '../models/ITrampoConfiguration';
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
    jobs: jobs.filter(Boolean) as TrampoJob,
  };

  return config;
}

export function getActionFunction(
  config: IOneTimeJob | ICronJob,
  cb?: (...args: unknown[]) => void,
): () => Promise<void> {
  if (config.exec) {
    return async () => {
      exec(config.exec!, cb);
    };
  }

  if (config.httpRequest) {
    return async () => {
      const { body: data, url, method, headers, params } = config.httpRequest!;
      const result = await axios.request({
        url,
        headers,
        method,
        data,
        params,
      });

      if (cb) {
        cb(result);
      }
    };
  }

  return async () => undefined;
}
