const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');
const ajvSchema = require('../../utils/ajvSchema');
const schema = require('../../schema/rent.json');
const enumValue = require('../../common/enum');

class Post {
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
        const rent = this.req.body;
        const insertQuery = `INSERT INTO rent ("user_id", "car_id") 
                           values(${rent.user_id}, ${rent.car_id})`;
        postgresql.query(insertQuery, (err, result) => {
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
}

module.exports = Post;