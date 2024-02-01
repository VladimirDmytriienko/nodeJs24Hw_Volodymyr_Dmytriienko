const colors = require('colors/safe');
config = require('config')

const colorsEnabled = config.get('colors_enabled') === '1';

colorsEnabled ? colors.enable() : colors.disable();

function logger(moduleName) {
    const logLevel = config.get('log_level');
    switch (logLevel) {
        case 'info':
            return {
                info: (...args) => console.info(colors.bgCyan(moduleName), ...args),
                warn: (...args) => console.warn(colors.bgYellow(moduleName), ...args),
                error: (...args) => console.error(colors.bgRed(moduleName), ...args),
            };
        case 'warn':
            return {
                info: () => { },
                warn: (...args) => console.warn(colors.bgYellow(moduleName), ...args),
                error: (...args) => console.error(colors.bgRed(moduleName), ...args),
            };
        case 'error':
            return {
                info: () => { },
                warn: () => { },
                error: (...args) => console.error(colors.bgRed(moduleName), ...args),
            };
    }
}

module.exports = logger;