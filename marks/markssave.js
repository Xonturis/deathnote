const fs = require('fs')

function save_marks(dpt, maq, marks) {
    let json_marks = JSON.stringify(marks)
    fs.writeFile('../last_marks_'+dpt+'_'+maq, json_marks, 'utf-8', ()=>{})
}

module.exports = save_marks