require('dotenv').config();
const jwt = require('jsonwebtoken');
const colors = require('colors');

let checkJWT = (req , res , next) =>{

    const authorization = req.headers['authorization'];

    console.log(colors.bgGreen(authorization));

    if(!authorization) return res.sendStatus(401);

    const token = authorization.split(' ')[1];
    
    jwt.verify(token , process.env.API_ACCESS_TOKEN ,(err , decoded) => {
        
        if(err) return res.sendStatus(403);

        req.userid = decoded.userID;
        next();
    });
}

module.exports = checkJWT;