const logout = (req ,res ,next) => {
    res.status(200).send({msg : "log out"});
}

module.exports = {logout};