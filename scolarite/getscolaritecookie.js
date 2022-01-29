const https = require('https')
const get_cookies_and_redirect = require('../cas-ha/getcookiesandredirect')


async function get_scolarite_cookie() {
  return new Promise(async(resolve, reject) => {
    const ticket_url = await get_cookies_and_redirect()
    const get_ticket = {
      hostname: 'scolarite.polytech.univ-nantes.fr',
      port: 443,
      path: ticket_url.replace("https://scolarite.polytech.univ-nantes.fr", ""),
      method: 'GET'
    }

    const req = https.request(get_ticket, res => {
      resolve(res.headers['set-cookie'][0].replace("; path=/", ""))
    })

    req.on('error', error => {
      reject(error)
    })
    req.end()

  })
}

module.exports = get_scolarite_cookie