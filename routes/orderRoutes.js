const express = require('express');
const router = express.Router();

const OrderRoutes=require("../controllers/ordercontrol");


router.post("/saveorder",OrderRoutes.saveorderC);
router.get("/fetchorderid",OrderRoutes.fetchorderC
)
router.get("/fetchorders",OrderRoutes.fetchordercontrol)
router.get("/fetchorderitems/:oid",OrderRoutes.orderitemcontrol);
router.put("/updatestatus",OrderRoutes.updatecontroller);
router.get("/fetchuserorders/:un",OrderRoutes.fetchuserOrderC)


module.exports=router;
