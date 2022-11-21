const { Client } = require('pg');
const logger = require('./logger');

const client = new Client({
    host: 'tiny.db.elephantsql.com',
    user: 'ckahowke',
    port: 5432,
    password: 'MbSYjlWHakqRkEl8cCdrgMYZY3lPN8lC',
    database: 'ckahowke'
});

const execute = async (query) => {
    try {
        await client.query(query);
        return true;
    } catch (error) {
        logger.error(error.stack);
        return false;
    }
};

const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        last_name VARCHAR(50),
        dob DATE,
        email_id VARCHAR(100),
            type VARCHAR(25)
    );
    CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(50),
        build VARCHAR(50),
        year INT,
        mode VARCHAR(50),
        owner int,
        geolocation VARCHAR(50),
        day_price DECIMAL,
        is_featured BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS rent (
        id SERIAL PRIMARY KEY,
        user_id int,
        car_id int UNIQUE
    );`;

execute(query).then((result) => {
    if (result) {
        logger.info('Init database done');
    }
});
module.exports = client;