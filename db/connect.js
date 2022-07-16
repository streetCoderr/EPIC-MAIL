const mongoose = require("mongoose");

const connectDB = (URI) => mongoose.connect(URI);

module.exports = connectDB