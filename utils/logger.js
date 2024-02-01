const colors = require('colors/safe');
const config = require('config');

const colorsEnabled = config.get('colorsEnabled');

colorsEnabled ? colors.enable() : colors.disable();

function logger(moduleName) {
    const logLevel = config.get('logLevel');

    const levelWeight = {
        info: 0,
        warn: 1,
        error: 2
    }

    return {
        info: (...args) => {
            if (levelWeight[logLevel] !== levelWeight.info) return; // info пише тільки на своєму лог левелі
            console.info(colors.bgCyan(moduleName), ...args)
        },
        warn: (...args) => {
            if (levelWeight[logLevel] > levelWeight.warn) return; // warn пише якщо виставлений лог левел info або warn
            console.warn(colors.bgCyan(moduleName), ...args)
        },
        error: (...args) => console.error(colors.bgRed(moduleName), ...args) // error пише завджи, немає умови коли він відключений :)
    }
}

module.exports = logger;