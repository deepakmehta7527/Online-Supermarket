const mongoose = require('mongoose');



var resetPasswordSchema = new mongoose.Schema(
  { username: String, token: String, exptime: String },
  { versionKey: false }
);
module.exports = mongoose.model(
  "resetpass",
  resetPasswordSchema,
  "resetpass"
);