const db = require("../../config/db");
const { conformer } = require("../../utils/db");

class Medical {
    static tag ="medico_fk";
    static template = [
        'douleur thoraciques',
        'difficultés respiratoires',
        'difficultés cardiovasculaire',
        'problème hématologique',
        'problèmes lymphatique',
        'problème gastro intestinal',
        'problème génital',
        'gain de poids',
        'perte de poids',
        'trouble musculosquelettique',
        'autres',
    ];

    static async dispose(ant){
        const sql = `
            insert into antecedent_medico(id) values("${ant[Medical.tag]}")
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async set(id , medico) {
        const A = conformer(Medical.template , medico)
        const sql = `
            update antecedent_medico 
            set 
                chest_pain=${A[0]},
                breathing_difficulties=${A[1]},
                cardiovascular_difficulties=${A[2]},
                hematological_problem=${A[3]},
                lymphatic_Problems=${A[4]},
                gastrointestinal_problem=${A[5]},
                genital_problem=${A[6]},
                weight_gain=${A[7]},
                weightloss=${A[8]},
                musculoskeletal_disorder=${A[9]},
                other=${A[10]},
                
                updateAt = CURRENT_TIMESTAMP()

            where id="${id}"
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async setDescription(id , description) {
        const sql = `
            update antecedent_medico 
            set
                description="${description}",
                updateAt = CURRENT_TIMESTAMP()

            where id="${id}"
        `;
        const data = await db.query(sql);
    }
}

module.exports = Medical;