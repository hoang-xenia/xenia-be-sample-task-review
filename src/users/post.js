const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');
const ajvSchema = require('../../utils/ajvSchema');
const schema = require('../../schema/user.json');
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
        const user = this.req.body;
        const insertQuery = `insert into users("name", "last_name", "dob", "email_id", "type") 
                           values('${user.name}', '${user.last_name}', '${user.dob}', '${user.email_id}', '${user.type}')`;
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
