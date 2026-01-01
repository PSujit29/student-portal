
const errorHandler = (err, req, res, next) => {

    // console.log(err)

    // Prefer explicit HTTP status fields; do NOT use generic `err.code`
    // because libraries (like Mongo) use it for non-HTTP numeric codes (e.g. 11000).
    let code = err.statusCode ?? err.status ?? 500
    let detail = err.detail ?? err.details ?? (err.error instanceof Error ? err.error.message : err.error) ?? null
    let message = err.message ?? "APPLICATION ERR..."
    let status = err.status ?? "APPLICATION_ERR"

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        code = 400
        detail = Object.values(err.errors).map(error => error.message)
        message = "Validation failed"
        status = "VALIDATION_ERROR"
    }

    // Handle Mongoose duplicate key errors (e.g. duplicate email)
    if (err.code === 11000) {
        code = 409

        // Extract the field name from the duplicate key error
        let duplicateField = 'field'
        let duplicateValue = 'value'

        if (err.keyPattern) {
            duplicateField = Object.keys(err.keyPattern)[0]
        }

        if (err.keyValue) {
            duplicateValue = err.keyValue[duplicateField]
        }

        detail = `Duplicate ${duplicateField} found: '${duplicateValue}' already exists`
        message = `A user with this ${duplicateField} already exists`
        status = "DUPLICATE_ERROR"
    }

    // Ensure `code` is a valid HTTP status for Express
    if (typeof code !== "number" || code < 100 || code >= 600) {
        code = 500
    }

    res.status(code).json({
        error: detail,
        message: message,
        status: status,
    })
}

module.exports = errorHandler