const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: String,
    name: String,
    phone: String,
    password: String,
});

module.exports = mongoose.model("Admin", adminSchema);