const errorHandler = (err, req, res, next) => {
    //console.log(err)
    let code = err.code ?? err.statusCode ?? 500
    let detail = err.detail ?? err.details ?? null
    let message = err.message ?? "APPLICATION ERR..."
    let status = err.status ?? "APPLICATION_ERR"

    //TODO: handling other errors and implementation

    res.status(code).json({
        errors: detail,
        message: message,
        status: status,
    })
}

module.exports = errorHandler