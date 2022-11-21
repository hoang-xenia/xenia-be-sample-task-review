const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');
const ajvSchema = require('../../utils/ajvSchema');
const schema = require('../../schema/user.json');
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
        const user = this.req.body;
        let query = 'update users set ';
        if (user.name) {
            query += `name = '${user.name}',`;
        }
        if (user.last_name) {
            query += `last_name = '${user.last_name}',`;
        }
        if (user.dob) {
            query += `dob = '${user.dob}',`;
        }
        if (user.email_id) {
            query += `email_id = '${user.email_id}',`;
        }
        if (user.type) {
            query += `type = '${user.type}',`;
        }
        query = query.slice(0, -1);
        query += ` where id = ${user.id}`;
        return query;
    }
}

module.exports = Put;
