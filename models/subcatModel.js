const mongoose=require("mongoose");

var subcatSchema = new mongoose.Schema(
  {
    catid: String,
    subcatname: String,
    picture: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("subcategory", subcatSchema, "subcategory"); // internal model name, schema_name, real collection_name
