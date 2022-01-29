const https = require('https')
const util = require('util');
const get_execution = require('./cas-ha/getexecution')

get_execution().then((ex) => console.log(ex))

/*
const auth_url = "https://cas-ha.univ-nantes.fr/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F"

const data = new util.TextEncoder().encode(
    JSON.stringify({
      todo: 'Buy the milk 🍼'
    })
)

const auth_options = {
    hostname: 'cas-ha.univ-nantes.fr',
    port: 443,
    path: '/esup-cas-server/login?service=https%3A%2F%2Fscolarite.polytech.univ-nantes.fr%2F',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
}

const execution_param_css_selector = "section.row:nth-child(7) > input:nth-child(1)"
const execution_elem_label = "value"

const req = https.request(auth_options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
})

req.on('error', error => {
  console.error(error)
})

req.write(data.toString())
req.end()


function auth_me(username, password) {

}
*/