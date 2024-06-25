const express = require('express');
const router = express.Router();


const accountreset=require('../controllers/resetpasscontroller');

router.get("/verifytoken", accountreset.resetpass);

module.exports=router;