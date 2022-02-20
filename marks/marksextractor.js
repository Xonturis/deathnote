const fs = require('fs')

// Regexp spécifique puisqu'il y a des tableaux dans la page, là on est sûr de prendre bien la bonne chose.
const regexp = /new NoteGraph\(\&quot\;graph_\d+\&quot\;,200,70,1.1,0\.5,2,false\).setValues\((\[(\d+(\.\d+)?,?)*\])\).setNote\(\d+(\.\d+)?\)\;/gm

function get_last_marks(dpt, maq) {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('../last_marks_'+dpt+'_'+maq, (err, data) => {
                // console.log("Opened ../last_marks_"+dpt+'_'+maq);
                // console.log(data);
                if (data === undefined) {
                    // console.log("undef");
                    resolve({})
                }else{
                    // console.log("def");
                    // console.log(JSON.parse(data));
                    resolve(JSON.parse(data))
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = get_last_marks