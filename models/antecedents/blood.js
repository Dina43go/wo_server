const db = require("../../config/db");

/**
 * Alias of Advenced health
 */
class Blood {
    static tag ="advanced_health_fk";

    static async dispose(ant){
        const sql = `
            insert into advanced_health_information(id) values("${ant[Blood.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , bloodGroupe , rh , electrophorese) {
        const sql = `
            update advanced_health_information
            set
                blood_groupe="${bloodGroupe}",
                rh="${rh}",
                electrophorese_hemoglobin="${electrophorese}",
                updateAt=CURRENT_TIMESTAMP()
            where id= "${id}"
        `;

        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports = Blood;