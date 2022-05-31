const Allergy = require('../models/antecedents/allergy');
const Chirurgical = require('../models/antecedents/chirurgical');
const Familial = require('../models/antecedents/familial');
const Gynecho = require('../models/antecedents/gynecho');
const Medical = require('../models/antecedents/medical');
const Blood = require('../models/antecedents/blood');
const Addict = require('../models/antecedents/addict');

const Profile = require('../models/profil');
const {antecedents} =require('../config/sql');
const DataShape = require('../models/shape');

const utils = require('../utils/utils');
const db_utils = require('../utils/db');
const db = require('../config/db');


const antecedent =async (req ,res ,next) => {

    let userfound = await Profile.byIdfk(req.params.id);
    if(utils.empty(userfound)) return res.status(403).json({err: "ce identifiant n'existe pas"});

    const [data,_] = await db.query(antecedents(req.params.id));
    res.status(200).send(DataShape.antecedent(data));
}
const setAntecedent = async (req ,res ,next) => {
    let body = req.body;
    let userfound = await Profile.byIdfk(body.id);

    if(utils.empty(userfound)) return res.status(403).json({err: "ce identifiant n'existe pas"});
    userfound = db_utils.extractObject(userfound);

    switch (body.setname) {
        case "addiction":
                await Addict.set(userfound.addiction_fk , body.data);
            break;
        
        case "allergy":
                await Allergy.set(userfound.allergy_fk , body.description);
            break;
        
        case "antecedent_chirurgico":
                await Chirurgical.set(userfound.chirurgico_fk , body.description);
            break
        
        case "antecedent_familial":
                await Familial.set(userfound.familial_fk , body.data);
                    if(body.description)
                        await Familial.setDescription(userfound.familial_fk , body.description);
            break
        
        case "antecedent_gynecho":
                await Gynecho.set(userfound.gynecho_fk , body.data);
            break;
        
        case "antecedent_medico":
                await Medical.set(userfound.medico_fk , body.data);
                    if(body.description)
                        await Medical.setDescription(userfound.medico_fk , body.description);
            break

        case "advanced_health_information":
                await Blood.set(userfound.advanced_health_fk , body.data.bloodGroupe,  body.data.rh , body.data.electrophorese);
            break;

        default:
            break;
    }
    res.status(200).send({msg : "changed"});
}

module.exports = {antecedent , setAntecedent};