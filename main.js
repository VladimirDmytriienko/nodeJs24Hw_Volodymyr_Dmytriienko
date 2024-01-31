require('dotenv').config();
const config = require('config')

const logger = require('./utils/logger')('main:');

logger.info('the script is running!!');

logger.warn('new warning warnw')

logger.error('new warning err')