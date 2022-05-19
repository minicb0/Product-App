const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
    personCodeInitials: {
        type: String
    },
    personCount: {
        type: Number
    }
});

const Constant = mongoose.model("CONSTANT", constantSchema);

module.exports = Constant;