/* tslint:disable:no-any */
import * as Joi from '@hapi/joi';

import { cronJobSchema, ICronJob, IOneTimeJob, oneTimeJobSchema } from '../models/ITrampoConfiguration';

export function isOneTimeJob(object: any): object is IOneTimeJob {
  const exists = Boolean(object.name && object.when && (object.httpRequest || object.exec));
  if (!exists) {
    return false;
  }

  const validated = Joi.validate<IOneTimeJob>(object, oneTimeJobSchema);
  return !validated.error;
}

export function isCronJob(object: any): object is ICronJob {
  const exists = Boolean(object.name && object.period && (object.httpRequest || object.exec));
  if (!exists) {
    return false;
  }

  const validated = Joi.validate<ICronJob>(object, cronJobSchema);
  return !validated.error;
}
