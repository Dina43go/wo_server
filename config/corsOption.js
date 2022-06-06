const allowed = require('../config/origin');
const corsOption = {
    origin: (origin , callback) => {
        if(allowed.indexOf(origin) !== -1 || !origin || allowed=="*") {
            callback(null , true);
        } else {
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus: 200,
}

module.exports = corsOption;