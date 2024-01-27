function logger(moduleName) {
    return {
        log: (...args) => console.log(moduleName, ...args),
        warn: (...args) => console.warn(moduleName, ...args),
        info: (...args) => console.info(moduleName, ...args)
    }
}

module.exports = logger
