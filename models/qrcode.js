const db = require("../config/db");

class QRCODE {
    constructor(id , profileId , path) {
        this.id = id;
        this.profileId = profileId;
        this.path = path
    }

    async save() {
        const sql = `
        insert into qr_code (id ,qrcodePath ,profileId_fk)
            values ("${this.id}" , "${this.path}" , "${this.profileId}")
        `;
        const [data,_] = await db.query(sql);
    }
}

module.exports = QRCODE;