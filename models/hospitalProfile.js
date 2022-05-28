const db = require('../config/db');

class HospitalProfile {

    constructor(id , designation , email , tel1 , tel2 , adresse , userid){
        this.id = id;
        this.designation = designation;
        this.email = email;
        this.tel1 = tel1;
        this.tel2 = tel2;
        this.adresse = adresse;
        this.userid = userid;
    }

    async save() {
        const sql =`
            insert into
            hopital_profil(
                hopitalProfileId,
                designation,
                email,
                tel_1,
                tel_2,
                adresse,
                user_userId
            )
            values ( "${this.id}" , "${this.designation}" , "${this.email}" , "${this.tel1}" , "${this.tel2}" , "${this.adresse}" , "${this.userid}")
        `;
        const [data, _] = await db.query(sql);
        return data;
    }

    static async All() {
        const sql = `select * from hopital_profil `;
        const [data,_] = await db.execute(sql);
        return data;
    }
}

module.exports = HospitalProfile;