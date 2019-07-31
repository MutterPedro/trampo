import logger, { finalLoggerHandler } from './utils/logger';

const events = ['unhandledRejection', 'uncaughtException'] as const;
// @ts-ignore
events.forEach(event => process.on(event, finalLoggerHandler(event)));

logger.info('it works');
