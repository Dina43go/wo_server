const antecedent = (req ,res ,next) => {
    res.status(200).send({msg : "antecedent"});
}

module.exports = {antecedent};