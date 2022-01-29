const https = require('https')

const auth_options = {
    hostname: 'cas-ha.univ-nantes.fr',
    port: 443,
    path: '/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F',
    method: 'GET'
}

const execution_regexp = /<input type="hidden" name="execution" value="([^"]*)"/

// See: https://stackoverflow.com/questions/19539391/how-to-get-data-out-of-a-node-js-http-get-request

function get_execution() {
    return new Promise((resolve, reject) => {
        const req = https.request(auth_options, res => {
            var body = [];
            res.on('data', d => {
                body.push(d);
            })
            res.on('end', function() {
                try {
                    body = Buffer.concat(body).toString();
                    execution = body.match(execution_regexp)[1]
                    resolve(execution);
                } catch(e) {
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


module.exports = get_execution

