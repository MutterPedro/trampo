import pino from 'pino';

import { name } from '../../package.json';

const logger = pino({ name, prettyPrint: true });
export default logger;

export const finalLoggerHandler = (message?: string) =>
  pino.final(logger, (err, finalLogger) => {
    finalLogger.error(err, message);
    process.exit(1);
  });
