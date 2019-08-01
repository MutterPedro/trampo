import pino from 'pino';

import { name } from '../../package.json';

const logger = pino({ name, prettyPrint: true });
export default logger;
