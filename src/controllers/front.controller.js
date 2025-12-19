class FrontController {
    homeRequest = (req, res, next) => {
        res.json({
            data: null,
            message: "test home request",
            status: "ok"
        })
    }
    handleHomeRequest = (req, res, next) => {
        res.json({
            data: null,
            message: "test handle home request",
            status: "ok"
        })
    }
}
module.exports = FrontController