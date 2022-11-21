const logger = require('./logger');

const removeEmpty = (obj) => {
    const newObj = obj;
    if (!obj) return null;
    for (const propName in newObj) {
        if (newObj[propName]) {
            const element = newObj[propName];
            if (element === 0) continue;
            if (element === null) continue;
            if (element === undefined || element.length === 0) {
                delete newObj[propName];
            } else if (typeof element === 'object') {
                removeEmpty(element);
            }
        }
    }
    return newObj;
};
const state = {
    request: 'request',
    validate: 'validate',
    process: 'process',
    response: 'response',
    end: 'end',
    reject: 'reject'
};

/**
 * nextState
 *
 * @param {any} currentState currentState
 * @return state
 */
const nextState = (currentState) => {
    switch (currentState) {
        case state.request:
            return state.validate;
        case state.validate:
            return state.process;
        case state.process:
            return state.response;
        case state.reject:
        case state.response:
            return state.end;
        case state.end:
            return state.end;
        default:
            return state.request;
    }
};

class Flow {
    constructor(selfRef) {
        this.self = selfRef;
        this.req_link = `${this.self.req.method} ${this.self.req.originalUrl}`;
        this.state = null;
        logger.info(`Request: ${this.req_link}`);
    }

    next() {
        this.state = nextState(this.state);
        if (this.state === state.end) {
            this.state = '';
            const returnData = {
                status: 200,
                message: 'ok',
                data: removeEmpty(this.self.data)
            };
            this.self.res.cache = returnData;
            logger.info(`Response: ${JSON.stringify(returnData)}`);
            return this.self.res.send(returnData || '', 200);
        }
        return this.self[this.state]();
    }

    reject(err) {
        const newError = {
            status: 400,
            message: 'error',
            data: err || 'ERROR'
        };
        this.self.res.cache = newError;
        this.state = '';
        logger.info(`Error: ${JSON.stringify(newError)}`);
        this.self.res.send(newError || '', 400);
    }
}

module.exports = Flow;
