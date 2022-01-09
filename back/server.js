require('dotenv').config()
const http = require('http')
const app = require('./app')

const normalizePort = val => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
    default:
      throw error
  }
}

const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

server.listen(port)

// https

var fs = require('fs')
const https = require('https')

const certificate = fs.readFileSync('./cert/fullchain.pem', 'utf8')
const privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8')

const credentials = { key: privateKey, cert: certificate }

const securePort = normalizePort(process.env.SEC_PORT || '8443')

const httpsServer = https.createServer(credentials, app)

httpsServer.on('error', errorHandler)
httpsServer.on('listening', () => {
  const address = httpsServer.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + securePort
  console.log('Listening on ' + bind)
})

httpsServer.listen(securePort)