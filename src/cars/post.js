const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');
const ajvSchema = require('../../utils/ajvSchema');
const schema = require('../../schema/car.json');
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
        const insertQuery = `insert into cars("brand", "build", "year", "mode", "owner", "geolocation", "day_price", "is_featured") 
                           values('${user.brand}', '${user.build}', '${user.year}', '${user.mode}', '${user.owner}', '${user.geolocation}', '${user.day_price}', '${user.is_featured}')`;
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