const https = require('https')
const getExecution = require('./getexecution')
const config = require('../../config.json')

async function getCookiesAndRedirect () {
  return new Promise((resolve, reject) => {
    const execution = getExecution()
    const username = config.username
    const password = config.password

    execution.then((executionResult) => {
      const data = new URLSearchParams(`username=${username}&password=${password}&otpPassword=&u2fSignature=&execution=${executionResult}&_eventId=submit&geolocation=`)

      const authOptions = {
        hostname: 'cas-ha.univ-nantes.fr',
        port: 443,
        path: '/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
          'cache-control': 'max-age=0',
          connection: 'keep-alive',
          'content-length': data.toString().length,
          'content-type': 'application/x-www-form-urlencoded',
          host: 'cas-ha.univ-nantes.fr',
          origin: 'https://cas-ha.univ-nantes.fr',
          referer: 'https://cas-ha.univ-nantes.fr/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F',
          'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': 'Windows',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
        }
      }

      const req = https.request(authOptions, res => {
        const fetched = res.headers.location
        resolve(fetched)
      })

      req.on('error', error => {
        reject(error)
      })

      req.end(data.toString())
    })
  })
}

module.exports = getCookiesAndRedirect
