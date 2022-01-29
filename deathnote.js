const get_scolarite = require('./scolarite/getscolarite')


async function printhtml() {
    const page = await get_scolarite()
    console.log(page)
}

printhtml()