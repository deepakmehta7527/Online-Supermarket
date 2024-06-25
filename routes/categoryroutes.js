const express = require('express');
const router = express.Router();
const multer = require("multer");
var jwt = require('jsonwebtoken');


const categorycontrollers = require('../controllers/categorycontrollers');

function verifytoken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized Request");
  }
  let token = req.headers.authorization;
  if (token == "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  if (!payload) {
    return res.status(401).send("Unauthorized Request");
  }
  next();
}

let mystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,`../frontend/public/uploads`); //we will have to create folder ourselves
  },
  filename: (req, file, cb) => {
    var picname = Date.now() + file.originalname; //1711956271167oil3.webp
    //milliseconds will be added with original filename and name will be stored in picname variable
    cb(null, picname);
  },
});
let upload = multer({ storage: mystorage });



router.post("/savecategory",verifytoken,upload.single("picture"),categorycontrollers.createcat);
router.delete("/delcat/:ud",categorycontrollers.deletecatcontroller);
router.get("/fetchallcat",categorycontrollers.fetchallcatcontroller);
router.put("/updatecategory",upload.single("picture"),categorycontrollers.updatecategorycontroller);




module.exports = router;