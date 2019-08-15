import pino from 'pino';

import { name } from '../../package.json';

const logger = pino({ name, prettyPrint: { colorize: true } });
export default logger;
