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

/**
 * @description cette fonction vérifie si un tableau est vide ou pas !
 * @param {Array} array Of Objects
 * @returns bool
 */
exports.empty = (array) => {
    return !(array.length > 0);
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