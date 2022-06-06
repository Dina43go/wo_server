let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let Users = require('../models/users');
let utils = require('../utils/utils');
let db = require('../config/db');
const Profile = require('../models/profil');
const { extractObject } = require('../utils/db');
const HospitalProfile = require('../models/hospitalProfile');
const login = async (req ,res) => {
    // get data from request {email , pasword}
    let R = {
        email: req.body.email,
        password: req.body.password
    };

    if(R.email == "" || R.password == "") 
        return res.status(401).json({err: "tous les champs doivent être rempli"});
    
    let donnees = await Users.checkAuth(R.email);
    if(utils.empty(donnees)) return res.status(403).json({err:"email incorrecte"});
    
    let result = await bcrypt.compare(R.password , donnees[0].password)
    
    if(result) {
        try {
            let [userGroup , _] = await db.execute(`select designation , description from usergroup where userGroupId=${donnees[0].userGroupId_fk};`);
            let profile = await Profile.byIdfk(donnees[0].userId);
            // on cree les tokens
            let pros = false;
            if(utils.empty(profile)) {
                pros = true;
                profile = await HospitalProfile.byId(donnees[0].userId);
            }
            
            profile = extractObject(profile);

            const assecceTocken= jwt.sign({
                user: {
                    id: donnees[0].userId,
                    profileId: profile.hopitalProfileId,
                    group: userGroup[0].designation
                }
            }, process.env.API_ACCESS_TOKEN , {expiresIn: '60s'});
    
            const refreshTocken= jwt.sign({
                user: {
                    id: donnees[0].userId,
                    profileId: profile.hopitalProfileId,
                    group: userGroup[0].designation
                }
            }, process.env.API_REFRESH_TOKEN , {expiresIn: '1d'});

            // on insert le refresh token dans la base de donnee
            await Users.setToken( donnees[0].userId , refreshTocken);
            
            res.cookie('jwt', refreshTocken , {httpOnly: true, sameSite:'None' , secure:'true' , maxAge: 24*60*60*1000});
            if(pros){
                res.cookie('doctorNumber',[],{httpOnly: true, sameSite:'None' , secure:'true', maxAge: 24*60*60*1000});
            }
            
            console.log(profile.hopitalProfileId);
            res.status(200).json({token : assecceTocken , designation:  profile.designation,});

        } catch (err) {
            console.log(err);
            res.status(500).json({err:"problème interne"});
        }

    } else res.status(403).json({err: "le mot de passe forni est incorrecte"});
}


const loginSingle = async (req,res)=> {

    if(req.body.id == "") 
        return res.status(401).json({err: "ce champ ne peut pas être vide"});
    
    let donnees = await Users.byId(req.body.id);

    if(!utils.empty(donnees)) {
        let [userGroup , _] = await db.execute(`select designation , description from usergroup where userGroupId=${donnees[0].userGroupId_fk};`);
        let profile = await Profile.byIdfk(donnees[0].userId);
        // on cree les tokens
        profile = extractObject(profile);

        const assecceTocken= jwt.sign({
            user: {
                id: donnees[0].userId,
                profileId: profile.profileId,
                group: userGroup[0].designation
            }
        }, process.env.API_ACCESS_TOKEN , {expiresIn: '60s'});

        const refreshTocken= jwt.sign({
            user: {
                id: donnees[0].userId,
                profileId: profile.profileId,
                group: userGroup[0].designation
            }
        }, process.env.API_REFRESH_TOKEN , {expiresIn: '1d'});

        let data = await Users.setToken( donnees[0].userId , refreshTocken);
                
        if(utils.affected(data)){
            res.cookie('jwt', refreshTocken , {httpOnly: true, sameSite:'None' , maxAge: 24*60*60*1000});
            res.status(200).json({token : assecceTocken});
        }
    } else res.status(403).json({err: "mauvais identifiant"});
    
}

module.exports = {login , loginSingle};