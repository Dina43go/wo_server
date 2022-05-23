const {logEvent} = require('./logs.js');

exports.erroHandler = (err ,req ,res ,next)=>{
    logEvent(`${err.name}\t${err.message}` , 'erroLog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);
}