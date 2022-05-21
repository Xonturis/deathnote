const fs = require('fs')

function saveMarks(dpt, maq, marks) {
  const jsonMarks = JSON.stringify(marks)
  fs.writeFile('../last_marks_' + dpt + '_' + maq, jsonMarks, 'utf-8', () => {})
}

module.exports = saveMarks
