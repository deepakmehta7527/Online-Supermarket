const express = require('express');
const router = express.Router();

const cartR=require("../controllers/Cartcontroller")

router.post('/addtocart',cartR.Cartcontrol)
router.get('/fetchcart/:uname',cartR.fetchcartc)

module.exports=router;
