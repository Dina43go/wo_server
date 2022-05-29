const db = require("../../config/db");

class Gynecho {
    static tag ="gynecho_fk";
    static template = ['party','gestity'];

    static async dispose(ant){
        const sql = `
            insert into antecedent_gynecho(id) values("${ant[Gynecho.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , state) {
        state = this.template.includes(state)? '\"'+state+'\"' : '\"party\"';
        const sql = `
            update antecedent_gynecho
            set 
                state= ${state},
                updateAt=CURRENT_TIMESTAMP()
            where id="${id}"
        `;
        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports= Gynecho;