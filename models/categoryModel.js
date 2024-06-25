const mongoose = require('mongoose');


var catSchema = new mongoose.Schema(
  {
    catname: String,
    picture: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("category", catSchema, "category"); // internal model name, schema_name, real collection_name