const http = require('http')
const server = http.createServer()
const logger = require('./utils/logger')('main:');

const port = 3000

server.listen(3000)

server.on('listening', () => console.log(`server starts on ${port} port!`))

const loggerHelper = (request, response) => {
    const infoString = `${request.method} ${request.url} ${response.statusCode}`
    
    request.method === 'GET' && request.url === '/healthcheck'?
        logger.info(infoString)
        : logger.warn(infoString)
}

server.on('request', (request, response) => {
    if (request.method !== 'GET') {
        response.writeHead(404);
        loggerHelper(request, response)
        response.end()
        return
    }
    if (/\/healthcheck/.test(request.url)) {
        response.write('healthcheck passed')
        loggerHelper(request, response)
        response.end()
    } else {
        response.writeHead(404)
        loggerHelper(request, response)
        response.end()
    }
})