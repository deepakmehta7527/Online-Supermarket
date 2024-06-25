const subcatModel=require("../models/subcatModel")

async function savesubcat(req,res){
  try {
    var picturename;
    if (!req.file) {
      picturename = "defaultpic.jpg";
    } else {
      picturename = req.file.filename;
    }

    var newrecord = new subcatModel({
      catid: req.body.catid,
      subcatname: req.body.scname,
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


async function fetchsubcat(req,res){
try {
  var result = await subcatModel.find({ catid: req.params.cid });
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



async function fetchsubcatupdate(req,res){
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

    var updateresult = await subcatModel.updateOne(
      { _id: req.body.subcatid },
      {
        $set: {
          catid: req.body.catid,
          subcatname: req.body.scname,
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

  async function deletesubcat(req,res){
    try {
      var result = await subcatModel.findByIdAndDelete(req.params.ud); //{ acknowledged: true, deletedCount: 1 }
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


module.exports={savesubcat,fetchsubcat,fetchsubcatupdate,deletesubcat};