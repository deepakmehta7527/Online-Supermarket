
const mongoose=require('mongoose');

var productSchema = new mongoose.Schema(
  {
    catid: String,
    subcatid: String,
    prodname: String,
    rate: Number,
    discount: Number,
    description: String,
    stock: Number,
    featured: String,
    addedon: String,
    picture: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("product", productSchema, "product"); // internal model name, schema_name, real collection_name