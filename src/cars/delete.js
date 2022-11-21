const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');

class Delete {
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
        postgresql.query(`delete from cars where id=${this.req.params.id}`, (err, result) => {
            if (!err) {
                this.data = result.rows;
                return this.flow.next();
            }
            logger.error(err.message);
            return this.flow.next();
        });
    }

    response() {
        return this.flow.next();
    }
}

module.exports = Delete;
