const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    reminder : String,
    dateofreminder : String,
    note : String,
    ownership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    toEmail: String,
});

module.exports = mongoose.model("Reminder", reminderSchema);