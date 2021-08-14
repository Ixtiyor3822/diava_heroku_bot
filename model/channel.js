const mongoose = require("mongoose")
const channelSchema  = mongoose.Schema({
    channelName : String,
    channelUrl : String
})

module.exports = mongoose.model("Channel",  channelSchema)