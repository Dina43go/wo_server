const db = require("../config/db");
const DataShape = require("../models/shape");

const userInfo = async (req ,res) => {
    const profile = req.profileId;
    const sql = `select * from profiles where profileId = "${profile}"`;
    const sql2 = `select qrcodePath from qr_code where profileId_fk="${profile}"`;
    const [data,_] = await db.query(sql);
    const [data2,__] = await db.query(sql2);


    res.status(200).json(DataShape.userProfile(data,data2));
}

module.exports = {userInfo};