const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
    discordId: {
        type: String
    },
    username: {
        type: String
    },
    discriminator: {
        type: Number
    }
})

module.exports = User = mongoose.model("user", UserSchema);