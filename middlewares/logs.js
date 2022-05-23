const fs = require('fs');
const path = require('path');
let {v4} = require('uuid');
const {makeDate , checkLogfolder} = require('../utils/utils');


/**
 * 
 * @param {String} message text
 * @param {String} fileName name of the file following by her extention .txt
 */

let logEvent = (message , fileName) => {

    let logLine = `${makeDate()} \t ${v4()} \t ${message} \n`;
    try {
        if (checkLogfolder()) {
            fs.appendFileSync(path.resolve(__dirname , '..' , 'logs' , fileName) , logLine);
        }
    } catch (err) {
        console.log(err);
    }
}

let requestLog = (req , res , next) => {

    logEvent(`${req.method}\t ${req.headers.origin} \t ${req.url}` , 'reqLog.txt')
    console.log(`${req.method}\t ${req.url}`.yellow.bold);
    next();
}

module.exports = {logEvent ,requestLog};
