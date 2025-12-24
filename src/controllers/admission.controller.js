const bcrypt = require('bcryptjs')
class AdmissionController {

    async register(req, res, next) {
        let data = req.data;
        console.log(data)
        data.password = bcrypt.hashSync(data.password)

        res.json({
            data: { data },
            message: "user register success",
            status: "TEST_REGISTER_USER"
        })
    }

    async apply(req, res, next) {
        let data = req.data;
        res.json({
            data: { data },
            message: "successful admission admission recieved",
            status: "TEST_APPLY_ADMISSION"
        })
    }

}

module.exports = AdmissionController