const db = require("../../config/db");
const { conformer } = require("../../utils/db");

class Familial {
    static tag ="familial_fk";
    static template = ['asthme','cancer','maladie cardiovasculaire','diabete','hypertension','epilepsie'];

    static async dispose(ant){
        const sql = `
            insert into antecedent_familial(id) values("${ant[Familial.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , hereditary) {
        const A = conformer(Familial.template , hereditary)
        const sql = `
            update antecedent_familial 
            set 
                asthme=${A[0]},
                cancer=${A[1]},
                maladie_cardiovasculaire=${A[2]},
                diabete=${A[3]},
                hypertension=${A[4]},
                epilepsie=${A[5]},
                updateAt = CURRENT_TIMESTAMP()

            where id="${id}"
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async setDescription(id , description) {
        const sql = `
            update antecedent_familial 
            set
                description="${description}",
                updateAt = CURRENT_TIMESTAMP()
            where id="${id}"
        `;
        const data = await db.query(sql);
    }
}

module.exports = Familial;