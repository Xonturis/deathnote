const fs = require('fs')

function getLastMarks (dpt, maq) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile('../last_marks_' + dpt + '_' + maq, (err, data) => {
        console.log('Opened ../last_marks_' + dpt + '_' + maq)
        // console.log(data);
        if (data === undefined || err) {
          console.log('undef')
          resolve({})
        } else {
          console.log('def')
          // console.log(JSON.parse(data));
          try {
            resolve(JSON.parse(data))
          } catch (err) {
            console.log('Error on reading file: %s', err)
            resolve({})
          }
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = getLastMarks
