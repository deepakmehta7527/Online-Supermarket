const mongoose=require('mongoose');

var cartSchema = new mongoose.Schema(
  {
    prodid: String,
    picture: String,
    pname: String,
    rate: Number,
    qty: Number,
    totalcost: Number,
    username: String,
  },
  { versionKey: false }
);
module.exports = mongoose.model("cart", cartSchema, "cart"); // internal model name, schema_name, real collection_name