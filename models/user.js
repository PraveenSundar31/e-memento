const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    phone: String,
    password: String,
    reminders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reminder"
    }]
});

module.exports = mongoose.model("User", userSchema);