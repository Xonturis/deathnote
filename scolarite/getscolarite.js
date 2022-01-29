const https = require('https')
const get_scolarite_cookie = require('./getscolaritecookie')


async function get_scolarite() {
    return new Promise(async (resolve, reject) => {
        const scolarite_cookie = await get_scolarite_cookie()
        const get_ticket = {
            hostname: 'scolarite.polytech.univ-nantes.fr',
            port: 443,
            path: "/",
            method: 'GET',
            headers: {
                'Cookie': scolarite_cookie
            }
        }

        const req = https.request(get_ticket, res => {
            var body = [];
            res.on('data', d => {
                body.push(d);
            })
            res.on('end', function () {
                try {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                } catch (e) {
                    reject(e);
                }
            })
        })

        req.on('error', error => {
            reject(error)
        })
        req.end()

    })
}

module.exports = get_scolarite