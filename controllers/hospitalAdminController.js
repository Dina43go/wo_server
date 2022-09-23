const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
let mailer = require('../config/email');
const {rolesState} = require('../config/roles');
const sql = require("../config/sql");

const Users = require('../models/users');
const HospitalProfile = require('../models/hospitalProfile');
const Emergency = require('../models/emergency');
const Position = require('../models/position');

const db = require('../config/db');
const DataShape = require('../models/shape');
const info = async (req ,res ,next) => {

    const [accidents,_] = await db.query(`select count(*) as accident from alerte where type = "accident"`)
    const [incendie,__] = await db.query(`select count(*) as incendie from alerte where type = "fire"`)
    const info = [{
        accidents:  accidents[0].accident,
        incendie: incendie[0].incendie
    }];
    res.status(200).json(info);
}

const addHospital = async (req ,res ,next) => {
    // generate password and id
    const ID = uniqid();
    let password = uniqid().toUpperCase().slice(7);

    let hopital = {
        email: req.body.email,
        designation: req.body.designation,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        adresse: req.body.adresse
    };

    if(hopital.email == "" || hopital.designation == "" || hopital.tel1 == "" || hopital.adresse == "") 
        return res.status(401).json({err: "les champs ne doivent pas être vide"});
      
    const userfound = await Users.byEmail(hopital.email);

    if(!utils.empty(userfound)) return res.status(409).json({err: "ce email existe déja"});

    const text = `
        <h3> Wo service Félicitation ! votre compte a été crée avec succès </h3>
        <h1>${hopital.designation}</h1>
        votre mot de passe d'authentification est : <strong>${password}</strong>
        <p>vous pouvez toute fois le changer plus tard une fois connecté a votre interface d'administration sur votre compte</p>
    `;

    try {
        const saltPassword = await bcrypt.hash(password , 10);

        mailer.transporter.sendMail(mailer.mailOption(hopital.email , text) , (err , info)=> {
            if(err) {
                log(err)
                return res.status(500).json({err:"un problème est survenue veillez réessayer plus tard"});
            }else {

                // create new user and profil
                const user = new Users(ID , hopital.email , saltPassword , rolesState.hopital);
                
                const buildId = uniqid(); // build profile id
                const profile = new HospitalProfile(buildId, hopital.designation, hopital.email , hopital.tel1 , hopital.tel2 , hopital.adresse , ID);
                
                // save data into database
                user.save();
                profile.save();
                
                //init emergency data              Hopital_profil  1---1 Emergency
                Emergency.init(buildId);

                return res.status(200).json({msg: "données enregistrées"});
            }
                
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "un truc s'est passé veillez réessayer plus tard"});
    }

}
const getAllHospital = async (req ,res ,next) => {
    try {
        const [data,_] = await db.query(sql.hospitals);
        // buid shape of data
        const squeletom = DataShape.hospitals(data);
        res.status(200).json(squeletom);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "impossible de récupérer les données"});
    }
}

const getHospital = async (req ,res ,next) => {

    try {
        let [result,_] = await db.query(sql.hospitals + `where H.hopitalProfileId="${req.params.id}"`);
        // buld shape of data
        const squeletom = DataShape.hospitals(result);
        res.status(200).json(squeletom);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "impossible de récupérer les données"});
    }
}

module.exports = {info , addHospital , getAllHospital ,getHospital};