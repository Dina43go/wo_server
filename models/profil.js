const db = require("../config/db")

class Profile {
    constructor(
        id,lastName,firstName1,firstName2,tel,profession,
        sex,nationality,birthday,adresse,fatherTel,motherTel,
        userId_fk
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
                sex,
                nationality,
                birthday,
                adresse,
                fatherTel,
                motherTel,
                createdAt
            ) values ("${this.id}","${this.lastName}",${firstName1},"${this.firstName2}",${tel},${profession},
                        "${this.sex}","${this.nationality}","${this.birthday}","${this.adresse}",${fatherTel},
                        ${motherTel}, CURRENT_TIMESTAMP())
        `;

        const [result,_] = await db.query(sql);
        return result;
    }
}

module.exports = Profile;