const colors = require('colors')

checkRoles = (...allowedRoles) => {

    return (req ,res ,next) => {
        if(!req?.group) return res.status(401).json({err:"you have note access.."});
        const roles = [...allowedRoles];

        const result = req.group.map(role=> roles.includes(role)).find(val=> val == true);
        
        if(!result) return res.status(403).json({err:"you have not permission..."});
        next();
    };
}
module.exports = checkRoles;