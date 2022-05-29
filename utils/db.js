/**
 * 
 * @param {Array} template 
 * @param {Array} arr 
 * @returns Array ["string"|null]
 */

let conformer = (template , arr) => {
    return template.map(addict=> {
        if(arr.includes(addict)) return addict;
    }).map(str=> {
        if(typeof str === "string") {
            const clone = str.split('')
            clone.push("\"")
            clone.unshift("\"")
            return clone.join('');
        }   else return null;
    });
}

const extractObject = (data)=>{
    return data[0];
}

module.exports = {conformer,extractObject};