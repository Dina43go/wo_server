const db = require('../config/db');
const uniqid = require('uniqid');

class Position {
    static async add({lng,lat} , refererId) {
        const sql = `
            insert into 
            positions(
                PositionId,
                lng,
                lat,
                refererId,
                createdAt
            ) 
            values ("${uniqid()}" , ${lng} , "${lat}", "${refererId}", CURRENT_TIMESTAMP());
        `;

        const [data ,_] = await db.query(sql);
        return data;
    }

    /**
     * 
     * @param {String} refererId id 
     */
    static async getLast(refererId) {
        const sql =`
            select * from positions where refererId="${refererId}"
            order by createdAt desc limit 1;
        `;

        const [data,_] = await db.query(sql);
        return data;
    }

    /**
     * 
     * @param {String} profileId attention !! only for hospital profile id
     */
    static async getHopitalPosition(profileId) {
        const sql = `
            select 
                * 
            from 
                positions 
            where 
                refererId="${profileId}"
        `;
    }

    /**
     * 
     * @param {String} profileId Attention !! id shoudl be a hopital profile ID
     * @param {Object} param1 {lng , lat}
     */
    static async setHopitalPosition(id , {lng , lat}) {
        const sql = `
            update positions 
            set 
                lng=${lng},
                lat=${lat},
                updateAt=CURRENT_TIMESTAMP()
            where refererId="${id}"
        `;
        const [data, _] = await db.execute(sql);
        return data;
    }
}

module.exports = Position;