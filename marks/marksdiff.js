const {extract_marks, get_last_marks} = require('./marksextractor')


// On teste si deux arrays sont "similaires"
// Càd que leurs valeurs sont ===
// Que des atomiques donc :eyes:
function similar(array_one, array_two) {
    if(array_one.length !== array_two.length) {
        return false
    }

    for (let i = 0; i < array_one.length; i++) {
        if(array_one[i] !== array_two[i]){
            return false
        }
    }

    return true
}

// On va trouver s'il existe un ou plusieurs array
// Qui se trouvent dans l'array one et pas dans le deux
function difference(array_one, array_two) {
    let difference = []


    for (let i = 0; i < array_one.length; i++) {
        let exists_in_two = false

        for (let j = 0; j < array_two.length; j++) {
            if(similar(array_one[i], array_two[j])){
                exists_in_two = true
            }
        }
        
        if(!exists_in_two) {
            difference.push(array_one[i])
        }
    }

    return difference
}



async function diff_marks(new_marks, old_marks) {
    return difference(new_marks, old_marks)
}

module.exports = {diff_marks, extract_marks}
