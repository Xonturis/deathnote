const getUpdatesAndSave = require('./scolarite/getscolarite')
const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const config = require('../config.json')
const token = config.token
const channelId = config.channel_id

let marksUpdateChannel

function sendUpdateSingle (text) {
  const message = `Yay, il y a une nouvelle note en **${text}**, vas donc voir, tu es trop curieux pour en rester là.\n\>\>\>\> https://scolarite.polytech.univ-nantes.fr/`
  marksUpdateChannel.send(message)
}

function sendUpdateMultiple (text) {
  const message = `Yay, il y a des nouvelles notes en **${text}**, vas donc voir, tu es trop curieux pour en rester là.\n\>\>\>\> https://scolarite.polytech.univ-nantes.fr/`
  marksUpdateChannel.send(message)
}

async function fetchGetDiffUpdate () {
  getUpdatesAndSave().then(subjectUpdate => {
    const text = subjectUpdate.join(', ')
    if (subjectUpdate.length === 1) {
      sendUpdateSingle(text)
    } else if (subjectUpdate.length > 1) {
      sendUpdateMultiple(text)
    }
  }).catch(err => {
    console.log(err)
  })
}

client.on('ready', (client) => {
  client.channels.fetch(channelId).then(channel => {
    marksUpdateChannel = channel
  })
})

client.login(token)

fetchGetDiffUpdate()

setInterval(() => {
  fetchGetDiffUpdate()
}, 7200000)
