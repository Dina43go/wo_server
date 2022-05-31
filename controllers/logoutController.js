let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Users = require('../models/users');
let utils = require('../utils/utils');
let db = require('../config/db');
const Profile = require('../models/profil');
const { extractObject } = require('../utils/db');

const logout = async (req ,res ,next) => {
    const cookies = req.cookies;
    
    if(cookies?.doctorNumber)
        res.clearCookie('doctorNumber',{httpOnly: true});

    if(!cookies?.jwt) return res.sendStatus(204);

    const token = cookies.jwt;
    const userfound = await Users.getToken(token);
    
    if (utils.empty(userfound)) {
        res.clearCookie('jwt',{httpOnly: true});
        return res.sendStatus(204);
    }

    await Users.setToken(userfound[0].userId , '');
    res.clearCookie('jwt',{httpOnly: true});
    res.sendStatus(204);
}

module.exports = {logout};