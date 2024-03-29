require('dotenv').config();
const jwt = require('jsonwebtoken');
const colors = require('colors');

let checkJWT = (req , res , next) =>{

    const authorization = req.headers['authorization'];

    // console.log(colors.bgGreen(authorization));

    if(!authorization) return res.sendStatus(401);

    const token = authorization.split(' ')[1];
    
    jwt.verify(token , process.env.API_ACCESS_TOKEN ,(err , decoded) => {
        // console.log("verify ::" ,decoded);
        if(err) {
            // console.log(err);
            return res.sendStatus(403);
        }
        req.userid = decoded.user.id;
        req.profileId = decoded.user.profileId;
        req.group = [decoded.user.group];
        next();
    });
}

module.exports = checkJWT;