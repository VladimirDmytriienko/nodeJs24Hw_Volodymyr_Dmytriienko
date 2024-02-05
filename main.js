require('dotenv').config();
const fileSync = require('./file_sync');
const logger = require('./utils/logger')('main:');

logger.info('the script is running!!');

logger.warn('new warning warnw')

logger.error('new warning err')

fileSync.start(logger);
