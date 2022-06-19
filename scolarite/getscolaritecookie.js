const https = require('https')
const getCookiesAndRedirect = require('../cas-ha/getcookiesandredirect')

async function getScolariteCookie () {
  return new Promise((resolve, reject) => {
    const ticketUrl = getCookiesAndRedirect()
    ticketUrl.then(ticketUrlResult => {
      if (ticketUrlResult === undefined) {
        reject(new Error('ticetUrlResult is null'))
      }
      const getTicket = {
        hostname: 'scolarite.polytech.univ-nantes.fr',
        port: 443,
        path: ticketUrlResult.replace('https://scolarite.polytech.univ-nantes.fr', ''),
        method: 'GET'
      }

      const req = https.request(getTicket, res => {
        resolve(res.headers['set-cookie'][0].replace('; path=/', ''))
      })

      req.on('error', error => {
        reject(error)
      })
      req.end()
    })
  }).catch((reason) => console.log(reason))
}

module.exports = getScolariteCookie
