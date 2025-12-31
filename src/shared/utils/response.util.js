function successResponse(res, {
	data = null,
	message = "Success",
	status = "SUCCESS",
	code = 200,
	meta = {},
} = {}) {
	const payload = {
		success: true,
		data,
		message,
		status,
	};

	if (meta && Object.keys(meta).length > 0) {
		Object.assign(payload, meta);
	}

	return res.status(code).json(payload);
}

function errorResponse(res, err) {
	const code = err.code || err.statusCode || 500;
	const payload = {
		success: false,
		message: err.message || "Something went wrong",
		status: err.status || "ERROR",
	};

	return res.status(code).json(payload);
}

module.exports = {
	successResponse,
	errorResponse,
};

