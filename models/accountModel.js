const mongoose = require('mongoose');

var registerSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    username: { type: String, unique: true },
    password: String,
    usertype: String,
    activated: Boolean,
    actcode: String,
  },
  { versionKey: false }
);


module.exports = mongoose.model("register", registerSchema, "register"); // internal model name, schema_name, real collection_name