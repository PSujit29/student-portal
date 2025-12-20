const multer = require("multer")
const fs = require("fs")

const uploader = () => {

    const myStorage = multer.diskStorage({

        destination: (req, file, cb) => {
            let path = "./public/uploads/"
            //create folder if not exist
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true })
            }
            cb(null, path)
        },

        filename: (req, file, cb) => {
            const filename = Date.now() + "-" + file.originalname;
            cb(null, filename)
        }

    });

    const fileFilter = (req, file, cb) => {
        const allowedExtension = ["jpg", "png", "jpeg", "webp", "gif", "svg", "bmp"]

        const exts = file.originalname.split(".").pop().toLowerCase().trim()
        if (allowedExtension.includes(exts)) {
            cb(null, true)
        }
        cb({ code: 422, message: "unsupported file format", status: "FILE_FORMAT_ERROR" })
    }

    return multer({
        storage: myStorage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
    })
}

module.exports = uploader