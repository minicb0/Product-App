const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
    personCodeInitials: {
        type: String
    }
});

const Constant = mongoose.model("CONSTANT", constantSchema);

module.exports = Constant;