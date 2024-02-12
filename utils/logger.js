const fileSync = require('fs');
const colors = require('colors/safe');
const config = require('config');

const colorsEnabled = config.get('colorsEnabled');

colorsEnabled ? colors.enable() : colors.disable();

const logPath = 'logs'
const isLogPath = fileSync.existsSync(logPath);
if (!isLogPath) {
    fs.mkdir(logPath);
}

const info = fileSync.createWriteStream('logs/info.log')
const error = fileSync.createWriteStream('logs/errors.log')

function writeToStream(name, moduleName, args) {
    name === 'info' ? info.write(`[${new Date().toISOString()}]  ${moduleName} ${args.join(' ')}.\n`)
        : error.write(`[${new Date().toISOString()}]  ${moduleName}: ${args.join(' ')}.\n`)
}

process.on('beforeExit', () => {
    info.end();
    error.end();
});

function logger(moduleName) {
    const logLevel = config.get('logLevel');

    const levelWeight = {
        info: 0,
        warn: 1,
        error: 2
    }

    return {
        info: (...args) => {
            writeToStream('info', moduleName, args)
            if (levelWeight[logLevel] !== levelWeight.info) return; // info пише тільки на своєму лог левелі
            console.info(colors.bgCyan(moduleName), ...args)
        },
        warn: (...args) => {
            writeToStream('error', moduleName, args)
            if (levelWeight[logLevel] > levelWeight.warn) return; // warn пише якщо виставлений лог левел info або warn
            console.warn(colors.bgCyan(moduleName), ...args)
        },
        error: (...args) => {
            writeToStream('error', moduleName, args)
            console.error(colors.bgRed(moduleName), ...args)
        } // error пише завджи, немає умови коли він відключений :)
    }
}

module.exports = logger;