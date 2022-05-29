const db = require("../../config/db");

class Chirurgical {
    static tag ="chirurgico_fk";
    static async dispose(ant){
        const sql = `
            insert into antecedent_chirurgico(id) values("${ant[Chirurgical.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , text) {
        const sql = `
            update antecedent_chirurgico 
            set description="${text}",
                updateAt = CURRENT_TIMESTAMP()
            where id="${id}"    
        `;
        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports = Chirurgical;