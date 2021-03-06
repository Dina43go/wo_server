const uniqid = require('uniqid');
const utils = require('../utils/utils');
const {conformer} = require('../utils/db');

const {rolesState} = require('../config/roles');

const DataShape = require('../models/shape');
const Users = require('../models/users');
const Profile = require('../models/profil');

const Allergy = require('../models/antecedents/allergy');
const Chirurgical = require('../models/antecedents/chirurgical');
const Familial = require('../models/antecedents/familial');
const Gynecho = require('../models/antecedents/gynecho');
const Medical = require('../models/antecedents/medical');
const Blood = require('../models/antecedents/blood');
const Addict = require('../models/antecedents/addict');
const db = require('../config/db');

const newPatient = async (req ,res ,next) => {
    const personne = req.body;

    if(personne.lastName =="" || personne.firstName2 =="" || personne.naissanceId =="")
        return res.status(401).json({err: "veiller remplir tous les champs"});
    
    const userfound = await Users.byEmail(personne.email);

    if(!utils.empty(userfound)) return res.status(409).json({err: "ce email existe déja"});

    try {
        
        const user = new Users(personne.naissanceId , personne.email , "" , rolesState.user);
        
        const identifiant = uniqid();
        const profile = new Profile(identifiant,personne.lastName,personne.firstName1,personne.firstName2,
                        personne.tel,personne.profession, personne.sex,personne.nationality,personne.birthDay,
                        personne.adresse,personne.fatherTel,personne.motherTel,personne.naissanceId);
        
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
        Familial.dispose(ids);
        Gynecho.dispose(ids);
        Medical.dispose(ids);
        Blood.dispose(ids);
        
        res.status(200).json({msg: "données enregistrées"});

    } catch (err) {
        console.log(err);
        res.status(500).send({err : "un problème est survenue"});
    }
}

const patient = async (req ,res ,next) => {
    
    try {
        const data = await Profile.byIdfk(req.params.id);
        if(!utils.empty(data))
            return res.status(200).json(DataShape.patientInfo(data));
        
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({err:"un problème est survenu"});
    }
    
}
function format(arr) {
    let add="";
    for(txt in arr) {
        add+=arr[txt]+"£-£p";
    }
    return add.slice(0 ,(add.length-4))
}
const addConsultation = async (req ,res ,next) => {
    // get req params
    const body = req.body;
    const id= uniqid();

    const P = conformer(["ref","traitement"] , body.pricing)
    const sql = `
        insert into consultation (
            consultationId,
            hopital_profile_fk,
            doctorId,
            patientId,
            numberOrder,

            hospital_designation,
            doctorName,
            weigth,
            pulse,
            temp,
            TA,

            dominant_complainte,
            order_signe,
            pricing_ref,
            pricing_trait,
            drugs_dosages,
            evolution,
            status,
            createdAt
        ) values (
            "${id}","${body.hopital_profile_id}","${body.doctorId}","${req.params.id}",${body.numberOrder},
            "${body.hopitalDesignation}","${body.doctorName}","${body.constantes.weigth}","${body.constantes.pulse}","${body.constantes.temps}","${body.constantes.TA}",
            "${body.dominantComplainte}","${body.orderSigne}",${P[0]},${P[1]},
            "${format(body.drugsDosage)}","${body.evolution}","${body.status}",CURRENT_TIMESTAMP()
        )
    `;

    try {
        await db.query(sql);
        return res.status(200).send({msg : "success"});
    } catch (err) {
        console.log(err);
        res.status(500).json({err:"un truc s'est mal passé"});
    }
}

const consultation = async (req ,res ,next) => {
    // req
    const sql = `select * from consultation where patientId="${req.params.id}"`;
    const [data ,_] = await db.query(sql);
    res.status(200).send(DataShape.consultation(data));
}



module.exports = {newPatient,patient,consultation,addConsultation};