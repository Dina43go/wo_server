const hospitalAdmin = (req ,res ,next) => {
    res.status(200).send({msg : "liste des hopitaux"});
}
const info = (req ,res ,next) => {
    res.status(200).send({msg : "Bah voila les infos"});
}

module.exports = {hospitalAdmin, info};