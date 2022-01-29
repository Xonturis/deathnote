const save_marks = require('./markssave')
const {extract_marks, get_last_marks} = require('./marksextractor')

async function get_diff_and_save(page) {
    const marks = extract_marks(page).length
    const last_update = await get_last_marks()
    let diff = Math.abs(marks - last_update)
    save_marks(marks)
    return diff
}

module.exports = get_diff_and_save