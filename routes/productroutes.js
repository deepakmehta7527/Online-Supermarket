const express = require("express");
const router = express.Router();
const multer = require("multer");


const prodcontrol = require("../controllers/productcontrollers");

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
  "/saveproduct",
  upload.single("picture"),
  prodcontrol.saveproductcontroller
);

router.get("/fetchprodsbysubcat/:scid", prodcontrol.fetchproduct);
router.get("/fetchproddetailsbyid/:pid", prodcontrol.fetchproductdetail);
router.put(
  "/updateproduct",
  upload.single("picture"),
  prodcontrol.productupdatecon
);
router.post(
  "/saveproduct",
  upload.single("picture"),
  prodcontrol.saveproductcontroller
);
router.get("/searchproduct/:term", prodcontrol.searchproductC);
router.get("/fetchfeatprods", prodcontrol.fetchFeatprods);
router.delete("/delprod/:ud", prodcontrol.deleteproductc);

module.exports = router;
