const Ajv = require('ajv');
const moment = require('moment');

const logger = require('./logger');

let split;
const ajv = new Ajv({
    allErrors: true
});
let dataString;

const checkRegex = (schema, data) => {
    const reg = new RegExp(schema, 'g');
    return reg.test(data.toString());
};
const checkDateTime = (schema, data) => {
    if (schema === 'date') {
        return moment(data.toString(), 'YYYY-MM-DD', true).isValid();
    }
    return moment(data.toString(), schema, true).isValid();
};
const checkNumberDecimal = (data, maxLength) => {
    if (typeof data === 'number') {
        split = data.toString().split('.');
        if (split.length > 1) {
            if (split[0].length <= 15 && split[1].length <= maxLength) {
                if (Number.isInteger(parseInt(split[0], 10))
                    && Number.isInteger(parseInt(split[1], 10))) {
                    return true;
                }
                return false;
            }
            return false;
        }
        if (Number.isInteger(parseInt(split[0], 10))) {
            return true;
        }
    }
    return false;
};
const checkNumberInt = (data) => {
    if (typeof data === 'number') {
        dataString = data.toString();
        split = dataString.split('.');
        if (split.length === 1) {
            if (Number.isInteger(parseInt(split[0], 10))) {
                return true;
            }
            return false;
        }
        return false;
    }
    return false;
};
const checkFormatNumber = (schema, data) => {
    if (!data) return true;
    if (schema === 'decimal2') {
        return checkNumberDecimal(data, 2);
    }
    if (schema === 'decimal4') {
        return checkNumberDecimal(data, 4);
    }
    if (schema === 'decimal6') {
        return checkNumberDecimal(data, 6);
    }
    if (schema === 'date') {
        return checkNumberInt(data);
    }
    if (schema === 'long') {
        return checkNumberInt(data);
    }
    return false;
};

const getPropsInvalid = (err) => {
    try {
        const prop = err.dataPath !== '' ? `${err.dataPath}`.replace('.', '') : err.params.missingProperty;
        return prop;
    } catch (error) {
        logger.error(`Api Base - getPropsInvalid: ${error} `);
    }
};

module.exports.validate = function validate(defObject, data) {
    if (!ajv.getKeyword('format_number')) {
        ajv.addKeyword('format_number', {
            type: 'number',
            validate: checkFormatNumber
        });
    }
    if (!ajv.getKeyword('format_datetime')) {
        ajv.addKeyword('format_datetime', {
            type: 'string',
            validate: checkDateTime
        });
    }
    if (!ajv.getKeyword('regex')) {
        ajv.addKeyword('regex', {
            type: 'string',
            validate: checkRegex
        });
    }
    const compile = ajv.compile(defObject);
    const valid = compile(data);
    if (!valid) {
        logger.error(`error on valid schema, data: ${JSON.stringify(data)}, defObject: ${JSON.stringify(defObject)}`);
        const errors = [];
        compile.errors.forEach(
            (err) => {
                const prop = getPropsInvalid(err);
                errors.push(prop);
            }
        );
    }
    return valid;
};