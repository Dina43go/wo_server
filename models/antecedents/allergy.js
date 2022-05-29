const db = require("../../config/db");

class Allergy {
    static tag ="allergy_fk";
    static async dispose(ant){
        const sql = `
            insert into allergy(id) values("${ant[Allergy.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , text) {
        const sql = `
            update allergy 
            set description="${text}",
                updateAt = CURRENT_TIMESTAMP()
            where id="${id}"    
        `;
        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports = Allergy;