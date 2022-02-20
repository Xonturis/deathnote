const https = require('https')
const get_scolarite_cookie = require('./getscolaritecookie')
const cheerio = require("cheerio");
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const get_last_marks = require('../marks/marksextractor')
const save_marks = require('../marks/markssave')


function extract_all_marks_name(bodyString) {
    return new Promise(async (resolve, reject) => {
        parser.parseString(bodyString, function(error, result) {
            if(error === null) {
                resolve(extract_subject_marks_mapping(result.datas.data[0].ATTR.value))
            }
            else {
                reject(error);
            }
        });
    })
    
}

function extract_subject_marks_mapping(bodyString) {
    let $ = cheerio.load(bodyString)
    let tables = $("table")
    let mapping = {}
    
    for(let i = 0; i < tables.length-1; i++) {
        
        let tableContent = tables[i].children[0]
        
        for(let tri = 1; tri < tableContent.children.length-2; tri++) {
            
            // console.log("--------------START------------" + tri)
            let tr = tableContent.children[tri]
            // console.log(tr)
            // console.log("---------------------------------------")
            let subject = $(tr.children[1]).text()
            // console.log(subject)
            // console.log("---------------------------------------")
            let theos = tr.children[3].children
            // console.log(theos.length);
            let prat = tr.children[4].children
            
            let ids = []
            
            for(let spi = 0; spi < theos.length; spi+=3){
                let mark = $(theos[spi].children[0]).text()
                if(mark !== '-') {
                    ids.push(mark)
                }
            }
            
            for(let spi = 0; spi < prat.length; spi+=3){
                let mark = $(prat[spi].children[0]).text()
                if(mark !== '-') {
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

function get_dpt_id($) {
    let dpt_id_el = $('#dpt')[0]
    let dpt_id = dpt_id_el.attribs.value
    return dpt_id
}

function get_maq_map($) {
    let maq_select_el = $('#maq')[0]
    let options = maq_select_el.children
    let id_maq_map = []
    for(let i = 0; i < options.length; i++) {
        let el = options[i]
        let id = el.attribs.value
        let maq = $(el).text()
        id_maq_map.push([id,maq])
    }
    
    return id_maq_map
}

async function get_dpt_marks_cheerio(dpt, maq) {
    return new Promise(async (resolve, reject) => {
        const scolarite_cookie = await get_scolarite_cookie()
        const get_ticket = {
            hostname: 'scolarite.polytech.univ-nantes.fr',
            port: 443,
            path: "/gestnote/?fct=bulletin&maq="+maq+"&dpt="+dpt,
            method: 'GET',
            headers: {
                'Cookie': scolarite_cookie
            }
        }
        
        const req = https.request(get_ticket, res => {
            var body = [];
            res.on('data', d => {
                body.push(d);
            })
            res.on('end', function () {
                try {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                } catch (e) {
                    reject(e);
                }
            })
        })
        
        req.on('error', error => {
            reject(error)
        })
        req.end()
        
    })
}

async function get_scolarite_cheerio() {
    return new Promise(async (resolve, reject) => {
        const scolarite_cookie = await get_scolarite_cookie()
        const get_ticket = {
            hostname: 'scolarite.polytech.univ-nantes.fr',
            port: 443,
            path: "/",
            method: 'GET',
            headers: {
                'Cookie': scolarite_cookie
            }
        }
        
        const req = https.request(get_ticket, res => {
            var body = [];
            res.on('data', d => {
                body.push(d);
            })
            res.on('end', function () {
                try {
                    body = Buffer.concat(body).toString();
                    resolve(cheerio.load(body));
                } catch (e) {
                    reject(e);
                }
            })
        })
        
        req.on('error', error => {
            reject(error)
        })
        req.end()
        
    })
}

async function get_maq_updates(id, maq) {
    return new Promise(async (resolve, reject) => {
        let subject_update = []
        get_dpt_marks_cheerio(id, maq).then(body=>{
            extract_all_marks_name(body).then(new_marks => {
                get_last_marks(id, maq).then(old_marks => {

                    let old_subjects = Object.keys(old_marks)
                    let new_subjects = Object.keys(new_marks)
                    
                    //region Make algorithm resilient to marks modification
                    // If this subject is "new" in the semester, let's see if there is any mark, and let's add it
                    for(let subject of new_subjects) {
                        if(old_subjects.indexOf(subject) === -1) {
                            old_marks[subject] = new_marks[subject]
                            old_subjects.push(subject)

                            // Any mark that we couldn't see (because we didn't know this subject existed)
                            if (new_marks[subject] > 0) {
                                subject_update.push(subject)
                            }
                        }
                    }
                    //endregion
                    
                    for(let subject of old_subjects) {
                        let old_val = old_marks[subject]
                        let new_val = new_marks[subject]
                        if(old_val !== new_val) {
                            subject_update.push(subject)
                        }
                    }
                    
                    save_marks(id, maq, new_marks)
                    
                    resolve(subject_update)
                })
            })
        })
    })
}

async function get_updates_and_save() {
    return new Promise(async (resolve, reject) => {
        try {
            get_scolarite_cheerio().then($ => {
                let id = get_dpt_id($)
                let promises = []
                for(let id_maq of get_maq_map($)) {
                    let maq = id_maq[0]

                    promises.push(get_maq_updates(id, maq))
                }
                
                let subject_updates = []
                Promise.all(promises).then(subjects_updates => {
                    for(subject_update of subjects_updates) {
                        subject_updates.push(...subject_update)
                    }
                    resolve(subject_updates)
                })
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = get_updates_and_save