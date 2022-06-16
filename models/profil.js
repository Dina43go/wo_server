const db = require("../config/db");

class Profile {
    constructor(
        id,lastName,firstName1,firstName2,tel,profession,
        sex,nationality,birthday,adresse,fatherTel,motherTel,
        userId_fk,profile
        ) {
        this.id = id     
        this.lastName = lastName 
        this.firstName1 = firstName1   //--> can be null
        this.firstName2 = firstName2
        this.tel = tel          //-- can be null
        this.profession = profession   //--> can be null
        this.sex = sex
        this.nationality = nationality
        this.birthday = birthday
        this.adresse = adresse
        this.fatherTel = fatherTel    //--> can be null
        this.motherTel = motherTel    //--> can be null
        this.profile = profile
        this.userId_fk = userId_fk
    }

    async save () {
        const firstName1 = this.firstName1 !=""? `\"${this.firstName1}\"` : null;
        const tel = this.tel !=""? `\"${this.tel}\"` : null;
        const profession = this.profession !=""? `\"${this.profession}\"` : null;
        const fatherTel = this.fatherTel !=""? `\"${this.fatherTel}\"` : null;
        const motherTel = this.motherTel !=""? `\"${this.motherTel}\"` : null;
        
        const sql = `
            insert into profiles (
                profileId,
                lastName,
                firstName1,
                firstName2,
                tel,
                profession,
                imgPath,
                sex,
                nationality,
                birthday,
                adresse,
                fatherTel,
                motherTel,
                userId_fk,
                createdAt
            ) values ("${this.id}","${this.lastName}",${firstName1},"${this.firstName2}",${tel},${profession},
                        "${this.profile}",
                        "${this.sex}","${this.nationality}","${this.birthday}","${this.adresse}",${fatherTel},
                        ${motherTel}, "${this.userId_fk}" , CURRENT_TIMESTAMP())
        `;

        const [result,_] = await db.query(sql);
        return result;
    }

    static async initAntecedents(id , {
        allergy_fk,
        chirurgico_fk,
        familial_fk,
        gynecho_fk,
        medico_fk,
        addiction_fk,
        advanced_health_fk
    }) {
        const sql=`
            update profiles set
                    allergy_fk = "${allergy_fk}",
                    chirurgico_fk = "${chirurgico_fk}",
                    familial_fk= "${familial_fk}",
                    gynecho_fk = "${gynecho_fk}",
                    medico_fk= "${medico_fk}",
                    addiction_fk="${addiction_fk}",
                    advanced_health_fk="${advanced_health_fk}"
            where profileId = "${id}"
        `;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async byIdfk(id){
        const sql = `select * from profiles where userId_fk="${id}"`;
        const [data,_] = await db.query(sql);
        return data;
    }

    static async byQRcode(profile_fk) {
        const sql = `select
            P.profileId,	P.lastName , P.firstName1 ,P.firstName2 , P.imgPath , P.birthday ,P.sex, P.adresse
            from profiles as P
            inner join qr_code as Q
        where P.profileId = "${profile_fk}" and Q.profileId_fk = "${profile_fk}"`;
        const [data,_] = await db.query(sql);
        return data;
    }
}

module.exports = Profile;