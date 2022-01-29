const fs = require('fs')

// Regexp spécifique puisqu'il y a des tableaux dans la page, là on est sûr de prendre bien la bonne chose.
const regexp = /new NoteGraph\(\&quot\;graph_\d+\&quot\;,200,70,1.1,0\.5,2,false\).setValues\((\[(\d+(\.\d+)?,?)*\])\).setNote\(\d+(\.\d+)?\)\;/gm


function extract_marks(subject) {
    let marks = []
    var match = regexp.exec(subject);
    while (match != null) {
        // Source https://stackoverflow.com/questions/5166862/javascript-regular-expression-iterator-to-extract-groups
        // matched text: match[0]
        // match start: match.index
        // capturing group n: match[n]
        marks.push(JSON.parse(match[1]))
        match = regexp.exec(subject);
    }
    return marks
}

function get_last_marks() {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('../last_marks', 'utf-8', (err, data) => {
                resolve(JSON.parse(data))
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    extract_marks: extract_marks,
    get_last_marks: get_last_marks
}