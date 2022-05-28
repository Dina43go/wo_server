const db = require('../config/db');
const uniqid = require('uniqid');

class Emergency {
    /**
     * cette fonction permet d'initialiser l'intence emergency pour un hopital donné
     * @param {String} id hopital profil Id
     */
     static async init(id) {
        const sql = `
            insert into emergency (id,hopitalProfilesId,driverNumbers,available)
                values ("${uniqid()}","${id}",0,false);
        `;
        const [result,_] = await db.query(sql);
        return result;
    }

    static async byId(id) {
        const sql = `
            select * from emergency where
                hopitalProfilesId="${id}"
        `;
        const [result,_] = await db.query(sql);
        return result;
    }


    /**
     * 
     * @param {String} id hopital profil Id
     * @param {Boolean} value 
     */
     static async setAvailable(id , value) {
        const sql = `
            update emergency
            set
                available=${value}
            where hopitalProfilesId ="${id}"
        `;
        const [result,_] = await db.query(sql); 
        return result;
    }

    /**
     * 
     * @param {String} id hopital profil Id
     * @param {Int16Array} value 
     */
     static async setDirverNumber(id , value) {
        const sql = `
            update emergency
            set
                driverNumbers=${value}
            where hopitalProfilesId ="${id}"
        `;
        const [result,_] = await db.query(sql); 
        return result;
    }
}

module.exports = Emergency;