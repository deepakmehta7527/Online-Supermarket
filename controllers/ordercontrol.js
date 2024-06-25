const OrderModel=require("../models/OrderModel")
const cartModel=require("../models/cartModel")
const productModel=require("../models/productModel")

async function saveorderC(req,res){
  try {
    var newrecord = new OrderModel({
      address: req.body.saddr,
      state: req.body.state,
      city: req.body.city,
      pmode: req.body.pmode,
      cardno: req.body.cardno,
      hname: req.body.hname,
      exp: req.body.exp,
      cvv: req.body.cvv,
      username: req.body.uname,
      OrderDate: new Date(),
      Status: "Order Received, Processing",
      OrderAmount: req.body.oamt,
      OrderItems: req.body.cartdata,
    });

    var result = await newrecord.save();
    if (result) {
      let updateresp = false;
      var updatelist = req.body.cartdata; //updatelist becomes an array becoz we are saving an json array into it
      for (let x = 0; x < updatelist.length; x++) {
        var updateresult = await productModel.updateOne(
          { _id: updatelist[x].prodid },
          { $inc: { stock: -updatelist[x].qty } }
        );
        if (updateresult.modifiedCount === 1) {
          updateresp = true;
        } else {
          updateresp = false;
        }
      }

      if (updateresp == true) {
        var delres = cartModel.deleteMany({ username: req.body.uname });
        if ((await delres).deletedCount >= 1) {
          res.json({ statuscode: 1 });
        } else {
          res.json({ statuscode: 0 });
        }
      } else {
        res.json({ statuscode: 0 });
      }
    } else {
      res.status(500).send({ statuscode: 0, msg: "Error while placing order" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ statuscode: -1, msg: e.message });
  }
}

async function fetchorderC(req,res){
  var result = await OrderModel.findOne({ username: req.query.un }).sort({
    OrderDate: -1,
  });
  console.log(result);
  if (!result) {
    res.send({ statuscode: 0 });
  } else {
    res.send({ statuscode: 1, data: result });
  }
}



async function fetchordercontrol(req,res)
{
  try {
    var result = await OrderModel.find().sort({ OrderDate: -1 });
    if (result.length > 0) {
      res.status(200).send({ statuscode: 1, data: result });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function orderitemcontrol(req,res)
{
  try {
    var result = await OrderModel.findOne({ _id: req.params.oid });
    if (result) {
      res.status(200).send({ statuscode: 1, data: result.OrderItems });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }

}

async function updatecontroller(req,res){
  try {
    var updateresult = await OrderModel.updateOne(
      { _id: req.body.oid },
      { $set: { Status: req.body.newstatus } }
    );

    if (updateresult.modifiedCount === 1) {
      res.status(200).send({ statuscode: 1 });
    } else {
      res.status(500).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function fetchuserOrderC(req,res){
  try {
    var result = await OrderModel.find({ username: req.params.un }).sort({
      OrderDate: -1,
    });
    if (result.length > 0) {
      res.status(200).send({ statuscode: 1, data: result });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

module.exports={saveorderC,fetchorderC,fetchordercontrol,orderitemcontrol,fetchuserOrderC,updatecontroller}




