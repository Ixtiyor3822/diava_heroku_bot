const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    order: Number,
    userId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    channels: [],
})
module.exports = mongoose.model("User", userSchema)