const consultation = (req ,res ,next) => {
    res.status(200).send({msg : "consultation"});
}

module.exports = {consultation};