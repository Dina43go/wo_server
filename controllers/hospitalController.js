const uniqid = require('uniqid');
const bcrypt =require('bcrypt');
const utils = require('../utils/utils');
const Emergency = require('../models/emergency');
const Position = require('../models/position');
const DataShape = require('../models/shape');
const Users = require('../models/users');
const {rolesState} = require('../config/roles');
const Profile = require('../models/profil');

const hospital = (req ,res ,next) => {
    res.status(200).send({msg : "profil de l'hopital"});
}

const emergency = async (req ,res ,next) => {
    try {
        const [data] = await Emergency.byId(req.params.id);
        const squeletom = DataShape.emergency(data);
        res.status(200).json(squeletom);
    } catch (err) {
        console.log(err);
        res.status(500).json({err:"un problème est survenu"});
    }
}

const setEmergency = async (req , res) => {
    const corps = req.body;
    if(corps.id === "" || corps.setname === "")
        return res.status(401).json({err: "veillez fournir les bonnes informations"});

    try {

        if (req.body.setname === "disponibility") {
            if(typeof corps.data !== "boolean") return res.status(403).json({err: "mauvaise donnée"})
            Emergency.setAvailable(corps.id , corps.data);
        }

        if(req.body.setname === "driverNumber") {
            if(typeof corps.data !== "number") return res.status(403).json({err: "mauvaise donnée"})
            Emergency.setDirverNumber(corps.id , corps.data);
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "un problème est survenu"});
    }
}

const position = async (req ,res ,next) => {
    const body = req.body;
    if(body.id ==="" || body.position == undefined)
        return res.status(401).json({err:"donnée manquante"});
    
    if (typeof body.position.lng !== "number" || typeof body.position.lat !== "number")
        return res.status(403).json({err:"les données de géolocalistion ne sont pas conforme"});

    const result = await Position.setHopitalPosition(body.id , body.position);

    if(utils.affected_(result)){
        res.sendStatus(200);
    } else return res.status(403).json({err:"un problème est survenu"});
}
const doctors = (req ,res) => {
    res.status(200).send({msg : "doctor"});
}

const postDoctor = async (req ,res) => {

    const doctor = req.body;
    if(doctor.lastName =="" || doctor.firstName2 =="" || doctor.profession =="" || doctor.naissanceId =="" || doctor.email == "" || doctor.tel == "")
        return res.status(401).json({err: "veiller renplir tous les champs"});

    const userfound = await Users.byEmail(doctor.email);

    if(!utils.empty(userfound)) return res.status(409).json({err: "ce email existe déja"});
    
    // build password
    const password = uniqid().toUpperCase().slice(5);
    const text = `
        <h3> Wo service Félicitation Docteur ${doctor.lastName.toUpperCase()} ${doctor.firstName1 !="" ? doctor.firstName1[0].toUpperCase()+"." : "" } ${utils.formatName(doctor.firstName2)} ! votre compte a été crée avec succès </h3>
        votre mot de passe d'authentification est : <strong>${password}</strong>
        <p>vous pouvez toute fois le changer plus tard </p>
    `;

    try {
        const saltPassword = await bcrypt.hash(password , 10);
        const user = new Users(doctor.naissanceId , doctor.email , saltPassword , rolesState.doctor);
        
        const profile = new Profile(uniqid(),doctor.lastName,doctor.firstName1,doctor.firstName2,
                        doctor.tel,doctor.profession, doctor.sex,doctor.nationality,doctor.birthDay,
                        doctor.adresse,doctor.fatherTel,doctor.motherTel,doctor.naissanceId);
        
        // save data
        user.save();
        profile.save();
        // handle init of antecedents
        
    } catch (err) {
        
    }
    res.status(200).send({msg : "doctor"});
}

module.exports = {hospital , emergency , setEmergency , position, doctors , postDoctor};