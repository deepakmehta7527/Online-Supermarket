const express = require("express");
const router = express.Router();
const multer = require("multer");

const subcatcontroll = require("../controllers/subcategorycontrollers");

let mystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/uploads"); //we will have to create folder ourselves
  },
  filename: (req, file, cb) => {
    var picname = Date.now() + file.originalname; //1711956271167oil3.webp
    //milliseconds will be added with original filename and name will be stored in picname variable
    cb(null, picname);
  },
});
let upload = multer({ storage: mystorage });

router.post(
  "/savesubcategory",
  upload.single("picture"),
  subcatcontroll.savesubcat
);
router.get("/fetchsubcat/:cid", subcatcontroll.fetchsubcat);
router.put(
  "/updatesubcategory",
  upload.single("picture"),
  subcatcontroll.fetchsubcatupdate
);
router.delete("/delsubcat/:ud", subcatcontroll.deletesubcat);

module.exports = router;
