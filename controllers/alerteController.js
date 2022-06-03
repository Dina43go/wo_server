const db = require('../config/db');
const sql = require('../config/sql');
const DataShape = require('../models/shape');
const alerts = async (req , res)=> {
    
    const [data,_] = await db.query(sql.alerte(req.body.min , req.body.max));
    res.status(200).json(DataShape.alerteListe(data));
}

module.exports = {alerts};