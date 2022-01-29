const fs = require('fs')

function save_marks(marks) {
    let json_marks = JSON.stringify(marks)
    fs.writeFile('../last_marks', json_marks, 'utf-8', ()=>{})
}

module.exports = save_marks