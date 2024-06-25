const productModel = require("../models/productModel");
const fs = require("fs");


async function saveproductcontroller(req, res) {
  try {
    var picturename;
    if (!req.file) {
      picturename = "defaultpic.jpg";
    } else {
      picturename = req.file.filename;
    }

    var newrecord = new productModel({
      catid: req.body.catid,
      subcatid: req.body.subcatid,
      prodname: req.body.pname,
      rate: req.body.rate,
      discount: req.body.dis,
      description: req.body.desc,
      stock: req.body.stock,
      featured: req.body.featured,
      addedon: new Date(),
      picture: picturename,
    });
    var result = await newrecord.save();
    if (result) {
      res.status(200).send({ statuscode: 1 });
    } else {
      res.status(500).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function fetchproduct(req, res) {
  try {
    var result = await productModel.find({ subcatid: req.params.scid });
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

async function fetchproductdetail(req, res) {
  try {
    var result = await productModel.findById(req.params.pid);
    console.log(result);
    if (result) {
      res.status(200).send({ statuscode: 1, data: result });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function productupdatecon(req, res) {
  try {
    var picturename;
    if (!req.file) {
      picturename = req.body.oldpicname;
    } else {
      picturename = req.file.filename;
      if (req.body.oldpicname !== "defaultpic.jpg") {
        fs.unlinkSync(`../frontend/public/uploads/${req.body.oldpicname}`);
      }
    }

    var updateresult = await productModel.updateOne(
      { _id: req.body.pid },
      {
        $set: {
          catid: req.body.catid,
          subcatid: req.body.subcatid,
          prodname: req.body.pname,
          rate: req.body.rate,
          discount: req.body.dis,
          description: req.body.desc,
          stock: req.body.stock,
          featured: req.body.featured,
          picture: picturename,
        },
      }
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

async function searchproductC(req, res) {
  var searchtext = req.params.term;

  var result = await productModel.find({
    prodname: { $regex: ".*" + searchtext, $options: "i" },
  });
  if (result.length === 0) {
    res.json({ statuscode: 0 });
  } else {
    res.send({ statuscode: 1, data: result });
  }
}

async function fetchFeatprods(req, res) {
  try {
    var result = await productModel.find({ featured: "yes" }).limit(6);
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

async function deleteproductc(req, res)
{
  try {
    var result = await productModel.findByIdAndDelete(req.params.ud); //{ acknowledged: true, deletedCount: 1 }
    console.log(result);
    if (result) {
      picturename = result.picture;
      if (picturename !== "defaultpic.jpg") {
        fs.unlinkSync(`../frontend/public/uploads/${picturename}`);
      }
      res.status(200).send({ statuscode: 1 });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1 });
  }
}

module.exports = {
  saveproductcontroller,
  fetchproductdetail,
  fetchproduct,
  productupdatecon,
  searchproductC,
  fetchFeatprods,
  deleteproductc
};
