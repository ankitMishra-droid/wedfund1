const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true
        },
        contentType: {
            type: String,
            required: true
        },
        data: {
            type: Buffer,
            required: true
        }
    }
)

const cv = mongoose.model('CV', FileSchema)
module.exports = cv