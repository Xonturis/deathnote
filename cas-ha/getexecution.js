'use-strict'

const https = require('https')

const authOptions = {
  hostname: 'cas-ha.univ-nantes.fr',
  port: 443,
  path: '/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F',
  method: 'GET'
}

const executionRegexp = /<input type="hidden" name="execution" value="([^"]*)"/

// See: https://stackoverflow.com/questions/19539391/how-to-get-data-out-of-a-node-js-http-get-request

function getExecution () {
  return new Promise((resolve, reject) => {
    const req = https.request(authOptions, res => {
      let body = []
      res.on('data', d => {
        body.push(d)
      })
      res.on('end', function () {
        body = Buffer.concat(body).toString()
        const matchResult = body.match(executionRegexp)
        if (matchResult == null || matchResult === undefined) {
          reject(new Error('Expression not found.'))
        } else {
          resolve(matchResult[1])
        }
      })
    })

    req.on('error', error => {
      reject(error)
    })
    req.end()
  })
}

module.exports = getExecution
