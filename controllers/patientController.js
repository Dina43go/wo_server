const patient = (req ,res ,next) => {
    res.status(200).send({msg : "patient"});
}

module.exports = {patient};