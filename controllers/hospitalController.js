const uniqid = require('uniqid');
const bcrypt =require('bcrypt');
const utils = require('../utils/utils');

const {rolesState} = require('../config/roles');
const sql = require('../config/sql');
let mailer = require('../config/email');

const Emergency = require('../models/emergency');
const Position = require('../models/position');
const DataShape = require('../models/shape');
const Users = require('../models/users');
const Profile = require('../models/profil');
const HospitalProfile = require('../models/hospitalProfile');

const Allergy = require('../models/antecedents/allergy');
const Chirurgical = require('../models/antecedents/chirurgical');
const Familial = require('../models/antecedents/familial');
const Gynecho = require('../models/antecedents/gynecho');
const Medical = require('../models/antecedents/medical');
const Blood = require('../models/antecedents/blood');
const Addict = require('../models/antecedents/addict');
const db = require('../config/db');


const hospitalProfilInfo = async (req ,res ,next) => {
    const data = await HospitalProfile.byId(req.params.id);
    
    if(!utils.empty(data))
        return res.status(200).json(DataShape.hospitalInfo(data));

    res.status(200).json(data);
}

const updatePassword = async (req ,res ,next) => {
    const body = req.body;
    if(body.id =="" || body.oldPasseword=="" || body.newPasseword =="")
        return res.status(401).json({err:"certaines informations sont manquantes"});

    const userInfo = await Users.byId(body.id);
    if(utils.empty(userInfo)) return res.status(403).json({err:"ce identifiant n'existe pas"});

    const match = await bcrypt.compare(body.oldPasseword , userInfo[0].password);
    if(match){
        try {
            const hash = await bcrypt.hash(body.newPasseword , 10);
            Users.setPassword(body.id , hash);

            const text = `
                <h3> Wo service Félicitation ! votre mot de passe a été changé avec succès </h3>
                le nouveau mot de passe d'authentification est : <strong>${body.newPasseword}</strong>
            `;
            
            mailer.transporter.sendMail(mailer.mailOption(userInfo[0].mail , text) , (err , info)=> {
                if(err){
                    console.log(err);
                    return res.status(500).json({err:"un problème est survenue veillez réessayer plus tard"});
                } else
                    return res.status(200).json({msg:"mot de passe changé avec success"});
            });

        } catch (err) {
            res.status(500).json({err:"quelque chose s'est produit"});
        }
    } else res.status(403).json({err : "le mot de passe fourni est incorrecte"});
    
}

const emergency = async (req ,res ,next) => {
    try {
        let data = await Emergency.byId(req.params.id);
        if(!utils.empty(data))
            return res.status(200).json(DataShape.emergency(data));

        res.status(200).json(data);
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
const doctors = async (req ,res) => {
    // hospital profile
    const [data , _] = await db.query(sql.doctorHospitalList(req.params.id));
    res.status(200).json(data);
}

const doctorsLogin = async (req,res)=> {

    let R = {
        email: req.body.email,
        password: req.body.password
    };

    if(R.email == "" || R.password == "") 
        return res.status(401).json({err: "les champs sont vides"});
    
    let donnees = await Users.checkAuth(R.email);

    if(utils.empty(donnees)) return res.status(403).json({err:"email incorrecte"});
    
    let result = await bcrypt.compare(R.password , donnees[0].password)
    
    if(result) {
        try {
            const data = await Profile.byIdfk(donnees[0].userId);
            // const assecceTocken= jwt.sign({
            //     doctor: {
            //         id: donnees[0].userId,
            //         group: userGroup[0]
            //     }
            // }, process.env.API_ACCESS_TOKEN , {expiresIn: '120s'});
            
            // res.status(200).json({token : assecceTocken});
        } catch (err) {
            res.status(500).json({err:"problème interne"});
        }

    } else res.status(403).json({err: "le mot de passe forni est incorrecte"});
}

const postDoctor = async (req ,res) => {

    const doctor = req.body;
    if(doctor.lastName =="" || doctor.firstName2 =="" || doctor.profession =="" || doctor.naissanceId =="" || doctor.email == "" || doctor.tel == "")
        return res.status(401).json({err: "veiller remplir tous les champs"});

    const userfound = await Users.byEmail(doctor.email);

    if(!utils.empty(userfound)) return res.status(409).json({err: "ce email existe déja"});
    
    // build password
    const password = uniqid().toUpperCase().slice(5);
    try {
        const saltPassword = await bcrypt.hash(password , 10);
        const user = new Users(doctor.naissanceId , doctor.email , saltPassword , rolesState.doctor);
        
        const identifiant = uniqid();
        const profile = new Profile(identifiant,doctor.lastName,doctor.firstName1,doctor.firstName2,
                        doctor.tel,doctor.profession, doctor.sex,doctor.nationality,doctor.birthDay,
                        doctor.adresse,doctor.fatherTel,doctor.motherTel,doctor.naissanceId);
        
        // save data
        user.save();
        profile.save();

        // handle init of antecedents

        const ids = {
            allergy_fk: uniqid(),
            chirurgico_fk: uniqid(),
            familial_fk: uniqid(),
            gynecho_fk: uniqid(),
            medico_fk: uniqid(),
            addiction_fk: uniqid(),
            advanced_health_fk:uniqid()
        }
        Profile.initAntecedents(identifiant ,ids);
        // dispose all antecedents table datas
        Allergy.dispose(ids);
        Addict.dispose(ids);
        Chirurgical.dispose(ids);
        Familial.dispose(ids)
        Gynecho.dispose(ids)
        Medical.dispose(ids);
        Blood.dispose(ids);
        
        const text = `
            <h3> Wo service Félicitation Docteur ${doctor.lastName.toUpperCase()} ${doctor.firstName1 !="" ? doctor.firstName1[0].toUpperCase()+"." : "" } ${utils.formatName(doctor.firstName2)} ! votre compte a été crée avec succès </h3>
            votre mot de passe d'authentification est : <strong>${password}</strong>
            <p>vous pouvez toute fois le changer plus tard </p>
        `;
        mailer.transporter.sendMail(mailer.mailOption(doctor.email , text) , (err , info)=> {
            if(err){
                console.log(err);
                return res.status(500).json({err:"un problème est survenue veillez réessayer plus tard"});
            } else
                return res.status(200).json({msg: "données enregistrées"});
        });

    } catch (err) {
        res.status(500).send({err : "un problème est survenue"});
    }
}

module.exports = {hospitalProfilInfo ,updatePassword , emergency , setEmergency , position, doctors , postDoctor ,doctorsLogin};