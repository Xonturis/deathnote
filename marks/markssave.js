const fs = require('fs')

function saveMarks (dpt, maq, marks) {
  console.log('Marks:')
  console.log(marks)
  console.log('../last_marks_' + dpt + '_' + maq)
  const jsonMarks = JSON.stringify(marks)
  fs.writeFile('../last_marks_' + dpt + '_' + maq, jsonMarks, 'utf-8', (err) => {
    if (err) {
      console.log('Error on reading file:', err)
    }
  })
}

module.exports = saveMarks
