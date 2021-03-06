const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { CreatQuery, SelectQuerytable, UpdateQuerytable, DeletQuerytable } = require('../config/CRUD');

const creat = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const QueryUser = CreatQuery(table, data);
        const { rows } = await db.query(`${QueryUser}`, colval);
        return rows[0].id;
    } catch (err) {
        console.log(err);
        throw err.detail;
    }
}


const find = async(table, data) => {
    try {
        if (data) {
            const colval = Object.keys(data).map(function(key) {
                return data[key];
            });
            const SelectQuery = SelectQuerytable(table, data);
            const { rows } = await db.query(`${SelectQuery}`, colval);
            return rows;
        } else {
            const { rows } = await db.query(`select * from ${table}`);
            return rows;
        }


    } catch (err) {
        throw err;
    }

}

const delet = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const deletQuery = DeletQuerytable(table, data);
        const { rows } = await db.query(`${deletQuery}`, colval);
        return rows;
    } catch (err) {
        throw err.detail;
    }

}

const update = async(table, where, data) => {

    try {
        console.log(where);
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const UpdateQuery = UpdateQuerytable(table, where, data);
        console.log(UpdateQuery);
        await db.query(`${UpdateQuery}`, colval);

    } catch (err) {
        throw err;
    }
}

const genarateAuthToken = (id) => {
    const token = jwt.sign({ id: id.toString() }, process.env.TOKEN_KEY)
    return token;
}

const getuser = async() => {
    const { rows } = await db.query('SELECT * FROM users ')
    return rows
}

const findByCredentials = async(email, password) => {
    try {
        const user = await find('users', { email });
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("why");
            throw "Unable to login ";
        }
        return user[0].id;
    } catch (err) {
        throw "Unable to login ";
    }
}

module.exports = {
    creat,
    find,
    delet,
    update,
    getuser,
    genarateAuthToken,
    findByCredentials
}