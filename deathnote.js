const get_updates_and_save = require('./scolarite/getscolarite')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const {token, channel_id} = require('../config.json')

let marks_update_channel = undefined

function send_update_single(text) {
    let message = `Yay, il y a une nouvelle note en **${text}**, vas donc voir, tu es trop curieux pour en rester là.\n\>\>\>\> https://scolarite.polytech.univ-nantes.fr/`
    marks_update_channel.send(message)
}

function send_update_multiple(text) {
    let message = `Yay, il y a des nouvelles notes en **${text}**, vas donc voir, tu es trop curieux pour en rester là.\n\>\>\>\> https://scolarite.polytech.univ-nantes.fr/`
    marks_update_channel.send(message)
}

async function fetch_get_diff_update() {
    let subject_update = await get_updates_and_save()

    let text = subject_update.join(", ")
    if(subject_update.length === 1) {
        send_update_single(text)
    }else if (subject_update.length > 1) {
        send_update_multiple(text)
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

