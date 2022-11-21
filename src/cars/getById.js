const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');

class GetById {
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
        postgresql.query(`Select * from cars where id=${this.req.params.id}`, (err, result) => {
            if (!err && result && result.rows) {
                if (result.rows.length > 0) {
                    this.data = result.rows[0];
                    return this.flow.next();
                }
                return this.flow.reject();
            }
            logger.error(err.message);
            return this.flow.reject();
        });
    }

    response() {
        return this.flow.next();
    }
}

module.exports = GetById;
