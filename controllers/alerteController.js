const db = require('../config/db');
const sql = require('../config/sql');
const DataShape = require('../models/shape');
const alerts = async (req , res)=> {
    console.log(req.body);
    try {
        const [data,_] = await db.query(sql.alerte(req.body.min , req.body.max));
        res.status(200).json(DataShape.alerteListe(data));
    } catch (err) {
        res.status(500).json({err: "nous ne parvenons pas a collecter les informations"});
    }
}

module.exports = {alerts};