const get_diff_and_save = require('./marks/getdiffandsavemarks')
const get_scolarite = require('./scolarite/getscolarite')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const {token, channel_id} = require('../config.json')

let marks_update_channel = undefined

function send_update(diff) {
    let count_new = diff.length
    let message = `Yay, il y a **${count_new}** nouvelle(s) note(s), vas donc voir, tu es trop curieux pour en rester là.\n\>\>\>\> https://scolarite.polytech.univ-nantes.fr/`
    marks_update_channel.send(message)
}

async function fetch_get_diff_update() {
    let page = await get_scolarite()
    let diff = await get_diff_and_save(page)

    if(diff.length > 0 && marks_update_channel !== undefined) {
        send_update(diff)
    }

}


client.on('ready', (client) => {
    client.channels.fetch(channel_id).then(channel => {
        marks_update_channel = channel
    })
})


client.login(token);

fetch_get_diff_update()

setInterval(() => {
    fetch_get_diff_update()
}, 7200000);

