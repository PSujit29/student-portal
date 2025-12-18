class FrontController {
    homeRequest = (req, res, next) => {
        res.json({
            data: null,
            messsage: "test home request",
            status: "ok"
        })
    }
    handleHomeRequest = (req, res, next) => {
        res.json({
            data: null,
            messsage: "test handle home request",
            status: "ok"
        })
    }
}
module.exports = FrontController