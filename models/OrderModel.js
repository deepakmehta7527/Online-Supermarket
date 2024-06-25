const mongoose=require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    address: String,
    state: String,
    city: String,
    pmode: String,
    cardno: String,
    hname: String,
    exp: String,
    cvv: String,
    username: String,
    OrderDate: String,
    Status: String,
    OrderAmount: Number,
    OrderItems: [Object],
  },
  { versionKey: false }
)

module.exports= mongoose.model("finalorder", orderSchema, "finalorder"); // internal model name, schema_name, real collection_name
