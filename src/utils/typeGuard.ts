/* tslint:disable:no-any */
import joi from '@hapi/joi';

import { cronJobSchema, ICronJob, IOneTimeJob, oneTimeJobSchema } from '../models/ITrampoConfiguration';

export function isOneTimeJob(object: any): object is IOneTimeJob {
  try {
    const exists = Boolean(object.name && object.when && (object.httpRequest || object.exec));
    if (!exists) {
      return false;
    }

    joi.assert(object, oneTimeJobSchema);

    return true;
  } catch (e) {
    return false;
  }
}

export function isCronJob(object: any): object is ICronJob {
  try {
    const exists = Boolean(object.name && object.period && (object.httpRequest || object.exec));
    if (!exists) {
      return false;
    }

    joi.assert(object, cronJobSchema);
    return true;
  } catch (e) {
    return false;
  }
}
