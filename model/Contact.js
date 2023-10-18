const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cv: {
        data: Buffer,
        contentType: String
        // required: true
    }
});

const userInfo = mongoose.model('UserInfo', contactSchema);
module.exports = userInfo;
