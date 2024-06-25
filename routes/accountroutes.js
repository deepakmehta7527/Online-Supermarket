const express = require('express');
const router = express.Router();

const accountController = require('../controllers/accountcontrollers');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: `${process.env.SMTP_UNAME}`,
    pass: `${process.env.SMTP_PASS}`,
  },
});

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


router.post("/signup", accountController.createUser);

router.get("/login", accountController.loginUser);
router.get("/activateaccount/:token",accountController.loginAccount);
router.post("/createadmin", accountController.LoginAdminAccount);
router.get("/fetchuserbyid/:uid",accountController.fetchUserid);
router.get("/searchuser",accountController.searchUser);
router.get("/forgotpassword",accountController.resetpassController);
router.get("/fetchusers",accountController.fetchusercontroller);
router.delete("/deluser/:uid",accountController.deleteusercontroller);
router.put("/changepass",accountController.changepasscontroller);
router.put("/resetpass",accountController.resetPassController);
router.post("/contactus",accountController.contactUs);

module.exports = router;
