const allowed = require('../config/origin');

console.log(allowed);

const credentials = (req , res , next) => {
    const origin = req.headers.origin;
    console.log('see origin ' , origin);

    if(allowed.includes(origin) || allowed == "*"){
        res.header("Access-Control-Allow-Credentials",true);
    }
    next();
}


module.exports = credentials;