const boom = require('@hapi/boom');
const joi = require('@hapi/joi');

function validate(data, schema) {
    const { error } = joi.object(schema).validate(data)
    return error;
}

function validationHandlers(schema, check = "body") {
    return function (req, res, next) { 
        const error = validate(req[check], schema);
        const errs = () => {
            const err = []
            for (let i = 0; i < error.details.length; i++) {
                const e = error.details[i];
                err.push(e.message)
            }
            return err
        }
        error ? res.json(errs()) : next();
     }
}

module.exports = validationHandlers;