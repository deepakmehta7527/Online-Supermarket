const cartModel=require("../models/cartModel")


async function Cartcontrol(req,res){
  try {
    var newrecord = new cartModel({
      prodid: req.body.prodid,
      picture: req.body.picname,
      pname: req.body.prodname,
      rate: req.body.remcost,
      qty: req.body.qty,
      totalcost: req.body.tc,
      username: req.body.uname,
    });

    var result = await newrecord.save();
    if (result) {
      res.status(200).send({ statuscode: 1 });
    } else {
      res
        .status(500)
        .send({ statuscode: 0, msg: "Error while adding to cart" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function fetchcartc(req,res){
  try {
    var result = await cartModel.find({ username: req.params.uname });
    console.log(result);
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



module.exports={Cartcontrol,fetchcartc
}