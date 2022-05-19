const fs = require('fs');
const path = require('path');
let {v4} = require('uuid');
const {makeDate , checkLogfolder} = require('../utils/utils');



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

let errConnectionLog = (req) => {
    let logLine = ``;
    let fileName= ``;

    try {
        if(checkLogfolder()){
            fs.appendFileSync(path.resolve(__dirname , '..' , 'logs' , fileName) , logLine);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {requestLog};
