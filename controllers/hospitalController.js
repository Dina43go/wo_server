const hospital = (req ,res ,next) => {
    res.status(200).send({msg : "profil de l'hopital"});
}

const emergency = (req ,res ,next) => {
    res.status(200).send({msg : "emergency"});
}

const position = (req ,res ,next) => {
    res.status(200).send({msg : "position"});
}
const doctor = (req ,res ,next) => {
    res.status(200).send({msg : "doctor"});
}

module.exports = {hospital , emergency, position, doctor};