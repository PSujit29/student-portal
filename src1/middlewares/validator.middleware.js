const Joi = require("joi")

const bodyValidator = (rules) => {
    return async (req, res, next) => {
        try {
            const data = req.body //fetch data
            // console.log({ data })

            if (!data || Object.keys(data).length === 0) {
                throw ({ code: 422, message: "NO data found", status: "DATA_NOT_FOUND" })
            }

            //validating data assuming the user is dumbass
            await rules.validateAsync(data, { abortEarly: false, allowUnknown: false })

            next() //passing to next scope
        } catch (exception) {
            let errorBag = {
                code: 400,
                message: "Validation Error",
                status: "VALIDATION_FAILED",
                details: {}
            }
            // console.log(exception)
            if (exception.details) {
                exception.details.forEach(err => {
                    errorBag.details[err.context.key] = err.message;
                });
            }

            next(errorBag)
        }
    }
}

module.exports = bodyValidator