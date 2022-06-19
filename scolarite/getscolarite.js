const https = require('https')
const getScolariteCookie = require('./getscolaritecookie')
const cheerio = require('cheerio')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ attrkey: 'ATTR' })
const getLastMarks = require('../marks/marksextractor')
const saveMarks = require('../marks/markssave')

function extractAllMarksName (bodyString) {
  return new Promise((resolve, reject) => {
    parser.parseString(bodyString, function (error, result) {
      if (error === null) {
        if (result.datas === undefined) {
          reject(new Error('result empty'))
        } else {
          resolve(extractSubjectMarksMapping(result.datas.data[0].ATTR.value))
        }
      } else {
        reject(error)
      }
    })
  })
}

function extractSubjectMarksMapping (bodyString) {
  const $ = cheerio.load(bodyString)
  const tables = $('table')
  const mapping = {}

  for (let i = 0; i < tables.length - 1; i++) {
    const tableContent = tables[i].children[0]

    for (let tri = 1; tri < tableContent.children.length - 2; tri++) {
      // console.log("--------------START------------" + tri)
      const tr = tableContent.children[tri]
      // console.log(tr)
      // console.log("---------------------------------------")
      const subject = $(tr.children[1]).text()
      // console.log(subject)
      // console.log("---------------------------------------")
      const theos = tr.children[3].children
      // console.log(theos.length);
      const prat = tr.children[4].children

      const ids = []

      for (let spi = 0; spi < theos.length; spi += 3) {
        const mark = $(theos[spi].children[0]).text()
        if (mark !== '-') {
          ids.push(mark)
        }
      }

      for (let spi = 0; spi < prat.length; spi += 3) {
        const mark = $(prat[spi].children[0]).text()
        if (mark !== '-') {
          ids.push(mark)
        }
      }

      // console.log(ids)
      // console.log("-------------END--------------")
      mapping[subject] = ids.length
    }
  }

  // console.log(mapping);

  return mapping
}

function getDptId ($) {
  const dptIdEl = $('#dpt')[0]

  if (dptIdEl === undefined) {
    return undefined
  }

  const dptId = dptIdEl.attribs.value
  return dptId
}

function getMaqMap ($) {
  const maqSelectEl = $('#maq')[0]
  const options = maqSelectEl.children
  const idMaqMap = []
  for (let i = 0; i < options.length; i++) {
    const el = options[i]
    const id = el.attribs.value
    const maq = $(el).text()
    idMaqMap.push([id, maq])
  }

  return idMaqMap
}

async function getDptMarksCheerio (dpt, maq) {
  return new Promise((resolve, reject) => {
    const scolariteCookie = getScolariteCookie()
    scolariteCookie.then(scolariteCookieResult => {
      const getTicket = {
        hostname: 'scolarite.polytech.univ-nantes.fr',
        port: 443,
        path: '/gestnote/?fct=bulletin&maq=' + maq + '&dpt=' + dpt,
        method: 'GET',
        headers: {
          Cookie: scolariteCookieResult
        }
      }

      const req = https.request(getTicket, res => {
        let body = []
        res.on('data', d => {
          body.push(d)
        })
        res.on('end', function () {
          try {
            body = Buffer.concat(body).toString()
            resolve(body)
          } catch (e) {
            reject(e)
          }
        })
      })

      req.on('error', error => {
        reject(error)
      })
      req.end()
    }).catch((reason) => console.log(reason))
  })
}

async function getScolariteCheerio () {
  return new Promise((resolve, reject) => {
    const scolariteCookie = getScolariteCookie()
    scolariteCookie.then(scolariteCookieResult => {
      const getTicket = {
        hostname: 'scolarite.polytech.univ-nantes.fr',
        port: 443,
        path: '/',
        method: 'GET',
        headers: {
          Cookie: scolariteCookieResult
        }
      }

      const req = https.request(getTicket, res => {
        let body = []
        res.on('data', d => {
          body.push(d)
        })
        res.on('end', function () {
          try {
            body = Buffer.concat(body).toString()
            resolve(cheerio.load(body))
          } catch (e) {
            reject(e)
          }
        })
      })

      req.on('error', error => {
        reject(error)
      })
      req.end()
    }).catch((reason) => console.log(reason))
  })
}

async function getMaqUpdates (id, maq) {
  return new Promise((resolve, reject) => {
    const subjectUpdate = []
    getDptMarksCheerio(id, maq).then(body => {
      extractAllMarksName(body).then(newMarks => {
        getLastMarks(id, maq).then(oldMarks => {
          const oldSubjects = Object.keys(oldMarks)
          const newSubjects = Object.keys(newMarks)

          // region Make algorithm resilient to marks modification
          // If this subject is "new" in the semester, let's see if there is any mark, and let's add it
          for (const subject of newSubjects) {
            if (oldSubjects.indexOf(subject) === -1) {
              oldMarks[subject] = newMarks[subject]
              oldSubjects.push(subject)

              // Any mark that we couldn't see (because we didn't know this subject existed)
              if (newMarks[subject] > 0) {
                subjectUpdate.push(subject)
              }
            }
          }
          // endregion

          for (const subject of oldSubjects) {
            const oldVal = oldMarks[subject]
            const newVal = newMarks[subject]
            if (oldVal !== newVal) {
              subjectUpdate.push(subject)
            }
          }

          saveMarks(id, maq, newMarks)

          resolve(subjectUpdate)
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  })
}

async function getUpdatesAndSave () {
  return new Promise((resolve, reject) => {
    try {
      getScolariteCheerio().then($ => {
        const id = getDptId($)

        if (id === undefined) {
          reject(new Error('No dpt id found'))
        }

        const promises = []
        for (const idMaq of getMaqMap($)) {
          const maq = idMaq[0]

          promises.push(getMaqUpdates(id, maq))
        }

        const subjectUpdates = []
        Promise.all(promises).then(subjectsUpdates => {
          for (const subjectUpdate of subjectsUpdates) {
            subjectUpdates.push(...subjectUpdate)
          }
          resolve(subjectUpdates)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = getUpdatesAndSave
