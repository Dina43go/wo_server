const db = require("../../config/db");
const { conformer } = require("../../utils/db");

class Addict {
    static tag ="addiction_fk";
    static  template = ['alcool','drogue','cigarette','cafeine'];
    
    static async dispose(ant){
        const sql = `
            insert into addiction(id) values("${ant[Addict.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , addicts) {
        const A = conformer(Addict.template , addicts)
        const sql = `
            update addiction 
            set 
                alcool=${A[0]},
                drogues=${A[1]},
                cigarettes=${A[2]},
                cafeines=${A[3]},
                updateAt = CURRENT_TIMESTAMP()
            where id="${id}"
        `;
        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports = Addict;