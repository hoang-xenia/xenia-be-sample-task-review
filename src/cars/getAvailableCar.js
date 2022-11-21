const Flow = require('../../utils/flow');
const postgresql = require('../../utils/postgresql');
const logger = require('../../utils/logger');

class GetAvailableCar {
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
        let queryString = `SELECT 
                                C.ID,
                                C.brand,
                                C.build,
                                C.YEAR,
                                C.MODE,
                                C.OWNER,
                                C.geolocation,
                                C.day_price,
                                C.is_featured 
                            FROM cars C LEFT JOIN rent r ON r.car_id = C.ID 
                            WHERE r.ID IS NULL `;
        const params = this.req.query || {};
        if (params.filter) {
            queryString += `AND (C.brand like '%${params.filter.toUpperCase()}%' 
                                    OR C.build like '%${params.filter.toUpperCase()}%'
                                    OR C.mode like '%${params.filter.toUpperCase()}%')
                            ORDER BY ID`;
        } else {
            queryString += ' ORDER BY ID';
        }
        postgresql.query(queryString, (err, result) => {
            if (!err && result && result.rows) {
                if (result.rows.length > 0) {
                    this.data = result.rows;
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

module.exports = GetAvailableCar;
