const uniqid = require('uniqid');
const Qrcode = require('qrcode');
const path = require('path');
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
const QRCODE = require('../models/qrcode');


const hospitalProfilInfo = async (req ,res ,next) => {

    // we d'ont neen req params

    const data = await HospitalProfile.byId(req.userid);
    if(!utils.empty(data))
        return res.status(200).json({
            doctorNumber: req.cookies.doctorNumber,
            info : DataShape.hospitalInfo(data)
        });

    res.status(200).json(data);
}

const updatePassword = async (req ,res ,next) => {
    const body = req.body;
    console.log(req.body);
    if(Object.keys(body).length === 0)
        return res.status(401).json({err:"veillez remplir tous les champs"});
    if(body.oldPasseword=="" || body.newPasseword =="")
        return res.status(401).json({err:"veillez remplir tous les champs"});

    const userInfo = await Users.byId(req.userid);
    if(utils.empty(userInfo)) return res.status(403).json({err:"ce identifiant n'existe pas"});

    const match = await bcrypt.compare(body.oldPasseword , userInfo[0].password);
    if(match){
        try {
            const hash = await bcrypt.hash(body.newPasseword , 10);
            Users.setPassword(req.userid , hash);

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
    console.log(req.userId);
    console.log(req.profileId);
    try {
        let data = await Emergency.byId(req.profileId);
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
    if(corps.setname === "")
        return res.status(401).json({err: "veillez fournir les bonnes informations"});

    console.log(corps);
    try {

        if (req.body.setname === "disponibility") {
            if(typeof corps.data !== "boolean") return res.status(403).json({err: "mauvaise donnée"})
            Emergency.setAvailable(req.profileId , corps.data);
            if(corps.data) 
                res.status(200).json({msg:"votre centre êtes actuelement disponible"});
            else
                res.status(200).json({msg:"votre centre êtes actuelement indisponible"});
        }

        if(req.body.setname === "driverNumber") {
            if(typeof corps.data != "string") return res.status(403).json({err: "mauvaise donnée"})
            Emergency.setDirverNumber(req.profileId , corps.data);
            res.status(200).json({msg: "vous disposé maintenant de $$ ambulance"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "un problème est survenu"});
    }
}

const position = async (req ,res ,next) => {
    const body = req.body;
    if(body.position.lng == "" || body.position.lat == "")
        return res.status(401).json({err:"donnée manquante"});
    
    if (typeof body.position.lng !== "number" || typeof body.position.lat !== "number")
        return res.status(403).json({err:"les données de géolocalistion ne sont pas conforme"});

    const result = await Position.setHopitalPosition(req.profileId , body.position);

    if(utils.affected_(result)){
        res.status(200).json({msg: "les données de géolocalisation viennent d'être ajusté"});
    } else return res.status(403).json({err:"vos données géographiques non pas pu être mis à jour"});
}

const doctors = async (req ,res) => {
    // hospital profile
    const [data , _] = await db.query(sql.doctorHospitalList(req.profileId));
    res.status(200).json(data);
}

const doctorsLogin = async (req,res)=> {
    console.log(req.body);
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
            // req.doctorNumber++;
            const doctor = {
                id: data[0].profileId,
                imgPath: data[0].imgPath,
                lastName: data[0].lastName,
                firstName: {
                    1:data[0].firstName1,
                    2:data[0].firstName2,
                },
                email: R.email,
                profession: data[0].profession
            }
            req.cookies.doctorNumber.push(doctor);
            console.log(req.cookies.doctorNumber);
            res.cookie('doctorNumber',req.cookies.doctorNumber,{httpOnly: true, maxAge: 24*60*60*1000});
            res.status(200).json(doctor);
            
        } catch (err) {
            res.status(500).json({err:"problème interne"});
        }

    } else res.status(403).json({err: "le mot de passe forni est incorrecte"});
}

const doctorsLogout = async (req, res) =>{
    const cookies = req.cookies;
    if(cookies?.doctorNumber) {
        const restofDoctors = cookies.doctorNumber.filter(data=> data.id != req.body.deconnexion);
        res.cookie('doctorNumber',restofDoctors,{httpOnly: true, maxAge: 24*60*60*1000});
    }
    res.status(200).send("log out");
}



const postDoctor = async (req ,res) => {

    const doctor = req.body;
    console.log(doctor);
    if(doctor.lastName =="" || doctor.firstName2 =="" || doctor.profession =="" || doctor.naissanceId =="" || doctor.email == "" || doctor.tel == "")
        return res.status(401).json({err: "veillez remplir les champs recommendés"});

    const userfound = await Users.byEmail(doctor.email);

    if(!utils.empty(userfound)) return res.status(409).json({err: "ce email existe déja"});
    
    // build password
    const password = uniqid().toUpperCase().slice(5);
    try {
        const saltPassword = await bcrypt.hash(password , 10);
        const user = new Users(doctor.naissanceId , doctor.email , saltPassword , rolesState.doctor);
        
        const identifiant = uniqid();
        const qrcodeId = uniqid();

        const profile = new Profile(identifiant,doctor.lastName,doctor.firstName1,doctor.firstName2,
                        doctor.tel,doctor.profession, doctor.sex,doctor.nationality,doctor.birthDay,
                        doctor.adresse,doctor.fatherTel,doctor.motherTel,doctor.naissanceId, `/store/doctor${doctor.sex}.png`);
        
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
        
        const pathe = path.join(__dirname , ".." , "public" , "qrcode");
        const name = doctor.lastName+ "qrcode" +doctor.firstName2 + ".png";

        try {
            await Qrcode.toFile( pathe+"/"+name , "salut");
            
            let qr = new QRCODE(qrcodeId , identifiant , '/qrcode/'+name);
            qr.save();

        } catch (err) {
            console.log(err);
            res.status(500).send({err : "un problème est survenue"});           
        }
        
        const text = `
            <h3> Wo service Félicitation Docteur ${doctor.lastName.toUpperCase()} ${doctor.firstName1 !="" ? doctor.firstName1[0].toUpperCase()+"." : "" } ${utils.formatName(doctor.firstName2)} ! votre compte a été crée avec succès </h3>
            votre mot de passe d'authentification est : <strong>${password}</strong>
            <p>vous pouvez toute fois le changer plus tard </p>
        `;
        mailer.transporter.sendMail(mailer.mailOption(doctor.email , text) , (err , info)=> {
            if(err){
                console.log(err);
                return res.status(500).json({err:"un problème est survenue l'or de l'envoide de mail"});
            } else
                return res.status(200).json({msg: "données enregistrées"});
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({err : "un problème est survenue"});
    }
}

module.exports = {hospitalProfilInfo ,updatePassword , emergency , setEmergency , position, doctors , postDoctor ,doctorsLogin ,doctorsLogout};