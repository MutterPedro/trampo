import * as Joi from '@hapi/joi';

type HttpMethod =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';

interface IHttpRequest {
  url: string;
  method: HttpMethod;
  headers?: object;
  body?: unknown;
  params?: object;
}

export interface ICronJob {
  name: NonNullable<string>;
  period: string;
  httpRequest?: IHttpRequest;
  exec?: string;
}

export interface IOneTimeJob {
  name: NonNullable<string>;
  when: string | number;
  httpRequest?: IHttpRequest;
  exec?: string;
}

export type TrampoJob = (IOneTimeJob | ICronJob)[];

export interface ITrampoConfiguration {
  jobs: TrampoJob;
}

export const httpRequestSchema = Joi.object().keys({
  url: Joi.string()
    .uri()
    .required(),
  method: Joi.string().equal('GET', 'POST', 'PUT', 'OPTIONS', 'HEAD', 'DELETE', 'CONNECT', 'TRACE', 'PATCH'),
  headers: Joi.object(),
  body: Joi.any(),
  params: Joi.object(),
});

export const oneTimeJobSchema = Joi.object()
  .keys({
    name: Joi.string()
      .min(1)
      .required(),
    when: [
      Joi.string()
        .min(1)
        .required(),
      Joi.number()
        .min(0)
        .required(),
    ],
    httpRequest: httpRequestSchema,
    exec: Joi.string(),
  })
  .without('httpRequest', 'exec');

export const cronJobSchema = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .required(),
  period: Joi.string()
    .regex(
      // tslint:disable-next-line:max-line-length
      /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
    )
    .min(1)
    .required(),
  httpRequest: httpRequestSchema,
  exec: Joi.string(),
});
