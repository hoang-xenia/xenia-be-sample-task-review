const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');
const ajvSchema = require('../../utils/ajvSchema');
const schema = require('../../schema/car.json');
const enumValue = require('../../common/enum');

class Put {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.flow = new Flow(this);
        this.flow.next();
    }

    request() {
        return this.flow.next();
    }

    validate() {
        if (ajvSchema.validate(schema, this.req.body)) {
            return this.flow.next();
        }
        return this.flow.reject(enumValue.ERROR_CODE.INVALID_PARAM);
    }

    process() {
        postgresql.query(this.genQuery(), (err, result) => {
            if (!err) {
                this.data = result.rows;
                return this.flow.next();
            }
            logger.error(err.message);
            return this.flow.reject();
        });
    }

    response() {
        return this.flow.next();
    }

    genQuery() {
        const car = this.req.body;
        let query = 'update cars set ';
        if (car.brand) {
            query += `brand = '${car.brand}',`;
        }
        if (car.build) {
            query += `build = '${car.build}',`;
        }
        if (car.year) {
            query += `year = '${car.year}',`;
        }
        if (car.mode) {
            query += `mode = '${car.mode}',`;
        }
        if (car.owner) {
            query += `owner = '${car.owner}',`;
        }
        if (car.geolocation) {
            query += `geolocation = '${car.geolocation}',`;
        }
        if (car.day_price) {
            query += `day_price = '${car.day_price}',`;
        }
        if (car.is_featured) {
            query += `is_featured = '${car.is_featured}',`;
        }
        query = query.slice(0, -1);
        query += ` where id = ${car.id}`;
        return query;
    }
}

module.exports = Put;
