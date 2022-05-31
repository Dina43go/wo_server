require('dotenv').config();
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { extractObject } = require('../utils/db');
const { empty } = require('../utils/utils');
// const Users = require('../models/Users');


exports.handleRefreshToken = async (req ,res , next) => {
    // verifier si le jeton rest présant dans les cookies
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(401);
    
    //seclectionne un utilisateur qui poccède ce token

    let user = await Users.getToken(cookies.jwt);
    
    if(empty(user)) return res.sendStatus(403);

    user = extractObject(user);

    jwt.verify(user.refresh_token , process.env.API_REFRESH_TOKEN , (err ,decoded)=>{
        console.log(decoded);
        if(err || decoded.user.id !== user.userId) res.sendStatus(403);

        const accessToken = jwt.sign({user: decoded.user} , process.env.API_REFRESH_TOKEN, {expiresIn : '60s'});
        res.status(200).json({accessToken});
    });   
}
