const mongoose = require("mongoose")

const subdev = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },
    subbed: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Channel'
        }
    ]
})

module.exports = mongoose.model("Subdev", subdev)