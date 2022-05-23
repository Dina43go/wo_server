require('dotenv').config();
const jwt = require('jsonwebtoken');
// const Users = require('../models/Users');


exports.handleRefreshToken = (req ,res , next) => {
    // verifier si le jeton rest présant dans les cookies
    const cookies = req.cookies;
    
    if(!cookies?.jwt) return res.sendStatus(401);

    //seclectionne un utilisateur qui poccède ce token

    // Users.findInUsers('user_rtoken' , cookies.jwt).then(([data , _])=> {
    //     if (data.length == 0) return res.sendStatus(403);
        
    //     const user = data[0];
    //     jwt.verify(user.user_rtoken , process.env.REFRESH_TOKEN , (err , decoded) => {
            
    //         if (err || user.userID !== decoded.userID) return res.sendStatus(403);
            
    //         const accessToken = jwt.sign({'userID' : user.userID} , process.env.ACCESS_TOKEN, {expiresIn : '30s'});
    //         res.json({accessToken});
    //     });
        
    // });    
}
