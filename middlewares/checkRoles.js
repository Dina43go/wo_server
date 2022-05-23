const colors = require('colors')
exports.checkRoles = (...allowedRoles) => {
    return (req ,res ,next) => {
        if(!req?.roles) return res.sendStatus(401);
        const roles = [...allowedRoles];

        console.log(colors.yellow('roles::') , roles);
        console.log(colors.yellow('roles::') , res.roles);

        const result = req.roles.map(role=> roles.includes(role)).fin(val=> val == true);
        
        if(!result) return res.sendStatus(401);
        next();
    }
}