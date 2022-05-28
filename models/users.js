const db = require('../config/db');
class Users {

    constructor( id , mail , password , usergroup){
        this.id = id;
        this.mail = mail;
        this.password = password;
        this.usergroup = usergroup;
    }

    async save(){
        const mail = this.mail !=""? `\"${this.mail}\"` : null;
        const sql = `
            insert into 
            users(
                userId,
                userGroupId_fk,
                mail,
                password,
                create_at
            ) 
            values ("${this.id}" , ${this.usergroup} , ${mail}, "${this.password}", CURRENT_TIMESTAMP());
        `;
        let [data,_] = await db.query(sql);
        return data;
    }
    // static
    static async byId(id) {
        const sql = `
            select
                *
            from
                users
            where
                userId = '${id}'
        `;

        let [data,_] = await db.query(sql);
        return data;
    }

    static async byEmail(email) {
        const sql = `
            select
                *
            from
                users
            where
                mail = '${email}'
        `;

        let [data,_] = await db.query(sql);
        return data;
    }

    static async checkAuth (email) {
        const sql = `
            select
                *
            from 
                users
            where
                mail = '${email}'
        `;
        let [data , _] = await db.query(sql);
        return data;
    };

    static async setToken(id , token) {
        const sql = `
            UPDATE users
                set refresh_token= "${token}"
            where userId = "${id}"
        `;
        let data = db.query(sql);
        return data;
    };
}

module.exports = Users;