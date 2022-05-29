/*
 *  Content our all function
 */

const colors = require('colors');
const path = require('path');
const fs = require('fs');
const fsPoromis = require('fs/promises');


/**
 * @description cette fonction retourne une une date
 * @returns string yyyy - mm - dd HH : mn : ss
 */
exports.makeDate = () => {
    let currentDatetime = new Date();
    return currentDatetime.getFullYear() + "-" + (currentDatetime.getMonth() + 1) + "-" + currentDatetime.getDate() + " " + currentDatetime.getHours() + ":" + currentDatetime.getMinutes() + ":" + currentDatetime.getSeconds();
}

exports.timeTampsToDate = (str) => {
    let currentDatetime = new Date(str);
    return currentDatetime.getDate() + "/" + (currentDatetime.getMonth() + 1) + "/" + currentDatetime.getFullYear() + " "   + currentDatetime.getHours() + ":" + currentDatetime.getMinutes();
}

/**
 * @description cette fonction retourne true si le tableau est vide 
 * @param {Array} array Of Objects
 * @returns bool
 */
exports.empty = (array) => {
    return !(array.length > 0);
}

/**
 * 
 * @param {Array} array 
 * @returns boolean
 */
exports.affected = (array) => {
    return array[0].affectedRows>0;
}
/**
 * 
 * @param {Object} data 
 * @returns boolean
 */
exports.affected_ = (data) => {
    return data.affectedRows>0;
}

exports.formatName = (name)=>{
    return name.slice(0,1).toUpperCase()+ name.slice(1);
}

/**
 * @description cette fonction vérifie l'existance d'un répertoir log et la crée si elle n'exite pas
 * @returns bool retourne fale en cas d'erreur
 */

exports.checkLogfolder = ()=> {
    try {
        if(!fs.existsSync(path.resolve(__dirname , '..' , 'logs'))) {
            fs.mkdir(path.resolve(__dirname , '..' , 'logs') , (err) => {
                if (err) throw err;
            });
            console.log('success::'.green.bold , 'le répertoir log à été crée');
        }
        return true;
    } catch (err) {
        return false
    }
}