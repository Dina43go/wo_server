let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Users = require('../models/users');
let utils = require('../utils/utils');
let db = require('../config/db');
const login = async (req ,res) => {
    // get data from request {email , pasword}
    let R = {
        email: req.body.email,
        password: req.body.password
    };

    if(R.email == "" || R.password == "") 
        return res.status(401).json({err: "tous les champs doivent être rempli"});
    
    let donnees = await Users.checkAuth(R.email);

    console.log(donnees[0].password);
    
    let result = await bcrypt.compare(R.password , donnees[0].password)
    
    if(result) {
        try {
            let [userGroup , _] = await db.execute(`select designation , description from usergroup where userGroupId=${donnees[0].userGroupId_fk};`);

            // on cree les tokens

            const assecceTocken= jwt.sign({
                user: {
                    id: donnees[0].userId,
                    group: userGroup[0]
                }
            }, process.env.API_ACCESS_TOKEN , {expiresIn: '59s'});
    
            const refreshTocken= jwt.sign({
                user: {
                    id: donnees[0].userId,
                    group: userGroup[0]
                }
            }, process.env.API_REFRESH_TOKEN , {expiresIn: '1d'});

            // on insert le refresh token dans la base de donnee
            let data = await Users.setToken( donnees[0].userId , refreshTocken);
            
            if(utils.affected(data)){
                res.cookie('jwt', refreshTocken , {httpOnly: true, maxAge: 24*60*60*1000});
                res.status(200).json({token : assecceTocken});
            }

        } catch (err) {
            res.status(500).json({err:"problème interne"});
        }

    } else res.status(403).json({err: "le mot de passe forni est incorrecte"});
}


const loginSingle = async (req,res)=> {

    if(req.body.id == "") 
        return res.status(401).json({err: "ce champ ne peut pas être vide"});
    
    let user = await Users.byId(req.body.id);

    if(!utils.empty(user)) {
        let [userGroup , _] = await db.execute(`select designation , description from usergroup where userGroupId=${user[0].userGroupId_fk};`);
        const assecceTocken= jwt.sign({
            user: {
                id: user[0].userId,
                group: userGroup[0]
            }
        }, process.env.API_ACCESS_TOKEN , {expiresIn: '59s'});

        const refreshTocken= jwt.sign({
            user: {
                id: user[0].userId,
                group: userGroup[0]
            }
        }, process.env.API_REFRESH_TOKEN , {expiresIn: '1d'});

        let data = await Users.setToken( user[0].userId , refreshTocken);
                
        if(utils.affected(data)){
            res.cookie('jwt', refreshTocken , {httpOnly: true, maxAge: 24*60*60*1000});
            res.status(200).json({token : assecceTocken});
        }
    } else res.status(403).json({err: "mauvais identifiant"});
    
}

module.exports = {login , loginSingle};