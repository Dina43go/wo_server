const allowed = ['http://www.wo-site.com','http://localhost:8080']
const corsOption = {
    origin: (origin , callback) => {
        if(allowed.indexOf(origin) !== -1 || !origin) {
            callback(null , true);
        } else {
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus: 200,
}

module.exports = corsOption;