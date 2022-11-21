const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');

class Get {
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
        return this.flow.next();
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
        const params = this.req.query || {};
        let query = 'Select * from users ';
        if (params.filter) {
            query += `where name like '%${params.filter}%'
                    OR last_name like '%${params.filter}%'
                    OR email_id like '%${params.filter}%'`;
        }
        return query;
    }
}

module.exports = Get;
