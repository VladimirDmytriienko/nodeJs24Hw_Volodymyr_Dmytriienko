const colors = require('colors/safe');
config = require('config')
colors.enable();


function logger(moduleName) {
    const logLevel = config.get('logLevel');
    const colorsEnabled = config.get('colors_enabled');

    const isLogLevelEnabled = (level) => {
        const logLevels = ['info', 'warn', 'error'];
        const logLevelIndex = logLevels.indexOf(logLevel);
        const levelIndex = logLevels.indexOf(level);

        return logLevelIndex < levelIndex || logLevelIndex === levelIndex;
    };

    return {
        info: (...args) => {
            if (isLogLevelEnabled('info')) {
                console.info(colorsEnabled === '1' ? colors.bgCyan(moduleName) : moduleName, ...args);
            }
        },
        warn: (...args) => {
            if (isLogLevelEnabled('warn')) {
                console.warn(colorsEnabled === '1' ? colors.bgYellow(moduleName) : moduleName, ...args);
            }
        },
        error: (...args) => {
            if (isLogLevelEnabled('error')) {
                console.error(colorsEnabled === '1' ? colors.bgRed(moduleName) : moduleName, ...args);
            }
        },
    };
}

module.exports = logger;