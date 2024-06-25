const registerModel = require("../models/accountModel");
const resetpassModel=require("../models/resetpassModel")
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();
var jwt = require("jsonwebtoken"); 

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: `${process.env.SMTP_UNAME}`,
    pass: `${process.env.SMTP_PASS}`,
  },
});

async function createUser(req, res) {
  try {
    const hash = bcrypt.hashSync(req.body.pass, 10);
    var token = uuid.v4();
    var newrecord = new registerModel({
      name: req.body.pname,
      phone: req.body.phone,
      username: req.body.uname,
      password: hash,
      usertype: "normal",
      activated: false,
      actcode: token,
    });

    var result = await newrecord.save();
    if (result) {
      const mailOptions = {
        from: "supermarket890@hotmail.com",
        to: req.body.uname,
        subject: "Activate your account :: SuperMarket.com",
        text: `Dear ${req.body.pname}\n\n Thanks for signing up on our website. Click on the following link to activate your account\n\n http://localhost:3000/activate?token=${token}`,
      };

      // Use the transport object to send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(200).send({ statuscode: -2, msg: "Error sending email" });
        } else {
          res.status(200).send({ statuscode: 1 });
          console.log("Email sent: " + info.response);
          res.send({ msg: "Message sent successfully" });
        }
      });
    } else {
      res.status(500).send({ statuscode: 0, msg: "Signup not successfull" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ statuscode: -1, msg: "Error Occured try again" });
  }
}

async function loginUser(req, res) {
  try {
    var result = await registerModel.findOne({ username: req.query.un });
    var result2 = await registerModel
      .findOne({ username: req.query.un })
      .select("-password")
      .select("-phone");
    if (result) {
      var passhash = result.password;
      if (bcrypt.compareSync(req.query.pass, passhash)) {
        if (result.activated === true) {
          if (result.usertype === "admin") {
            //token issue
            let token = jwt.sign(
              { data: result._id },
              process.env.TOKEN_SECRET_KEY,
              { expiresIn: "1h" }
            );
            res
              .status(200)
              .send({ statuscode: 1, userdata: result2, jtoken: token });
          } else {
            res.status(200).send({ statuscode: 1, userdata: result2 });
          }
        } else {
          res.status(200).send({ statuscode: 2 });
        }
      } else {
        res
          .status(200)
          .send({ statuscode: 0, msg: "Username/Password Incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ statuscode: 0, msg: "Username/Password Incorrect" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
}

async function loginAccount(req, res) {
  try {
    var updateresult = await registerModel.updateOne(
      { actcode: req.params.token },
      { $set: { activated: true } }
    );

    if (updateresult.modifiedCount === 1) {
      res.send({ statuscode: 1 });
    } else {
      res.send({ statuscode: 0 });
    }
  } catch (e) {
    res.status(500).send({ statuscode: -1 });
  }
}


async function LoginAdminAccount(req, res) {
try {
  const hash = bcrypt.hashSync(req.body.pass,10);
  var token = uuid.v4();
  var newrecord = new registerModel({
    name: req.body.pname,
    phone: req.body.phone,
    username: req.body.uname,
    password: hash,
    usertype: "admin",
    activated: false,
    actcode: token,
  });

  var result = await newrecord.save();
  if (result) {
    const mailOptions = {
      from: "supermarket890@hotmail.com",
      to: req.body.uname,
      subject: "Activate your account :: SuperMarket.com",
      text: `Dear ${req.body.pname}\n\n Thanks for signing up on our website. Click on the following link to activate your account\n\n http://localhost:3000/activate?token=${token}`,
    };

    // Use the transport object to send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(200).send({ statuscode: -2, msg: "Error sending email" });
      } else {
        res.status(200).send({ statuscode: 1 });
        console.log("Email sent: " + info.response);
        res.send({ msg: "Message sent successfully" });
      }
    });
  } else {
    res.status(500).send({ statuscode: 0, msg: "Signup not successfull" });
  }
} catch (e) {
  console.log(e.message);
  res.status(500).send({ statuscode: -1, msg: "Error Occured try again" });
}

}


async function fetchUserid (req, res) {
try
{
    var result = await registerModel.findOne({_id:req.params.uid}).select("-password").select("-phone");
    if(result)
    {
        if(result.usertype==="admin")
        {
            //token issue
            let token = jwt.sign({data: result._id}, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
            res.status(200).send({statuscode:1,userdata:result,jtoken:token})
        }
        else
        {
            res.status(200).send({statuscode:1,userdata:result})
        }
    }
    else
    {
        res.status(200).send({statuscode:0,msg:"Username/Password Incorrect"})
    }
}
catch(e)
{
    console.log(e);
    res.status(500).send({statuscode:-1,msg:"Some error occured"})
}
}



async function searchUser(req, res) {
{
try {
  var result = await registerModel
    .findOne({ username: req.query.un })
    .select("-password");
  console.log(result);
  if (result) {
    res.status(200).send({ statuscode: 1, udata: result });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
} catch (e) {
  console.log(e);
  res.status(500).send({ statuscode: -1, msg: "Some error occured" });
}
}
}



async function resetpassController(req, res) {
try {
  var result = await registerModel.findOne({ username: req.query.un });
  console.log(result);
  if (result) {
    var resettoken = uuid.v4();
    var minutesToAdd = 15;
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

    var newreset = new resetpassModel({
      username: req.query.un,
      token: resettoken,
      exptime: futureDate,
    });
    let saveresult = await newreset.save();

    if (saveresult) {
      const resetLink = `http://localhost:3000/resetpassword?token=${resettoken}`;
      const mailOptions = {
        from: "supermarket890@hotmail.com",
        to: req.query.un,
        subject: "Reset your password::ShoppingPlaza.com",
        text: `Hi ${result.name},\n\n Please click on the following link to reset your password: \n\n ${resetLink}`,
      };
      // Use the transport object to send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send({ msg: "Error sending email" });
        } else {
          console.log("Email sent: " + info.response);
          res
            .status(200)
            .send({ msg: "Please check your mail to reset your password" });
        }
      });
    } else {
      res.send({ msg: "Error, try again" });
    }
  } else {
    res.status(200).send({ msg: "Invalid Username" });
  }
} catch (e) {
  console.log(e);
  res.status(500).send({ statuscode: -1, msg: "Some error occured" });
}
}


async function fetchusercontroller(req, res) {
try {
  var result = await registerModel.find().select("-password");
  console.log(result);
  if (result) {
    res.status(200).send({ statuscode: 1, allusers: result });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
} catch (e) {
  console.log(e);
  res.status(500).send({ statuscode: -1, msg: "Some error occured" });
}
}


async function deleteusercontroller(req, res) {
try {
  var result = await registerModel.findByIdAndDelete(req.params.uid); //{ acknowledged: true, deletedCount: 1 }
  console.log(result);
  if (result) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
} catch (e) {
  console.log(e);
  res.status(500).send({ statuscode: -1 });
}
}


async function changepasscontroller(req, res) {

try {
  var result = await registerModel.findOne({ username: req.body.uname });
  if (result) {
    var passhash = result.password;
    if (bcrypt.compareSync(req.body.currpass, passhash)) {
      const encpass = bcrypt.hashSync(req.body.newpass, 10);
      var updateresult = await registerModel.updateOne(
        { username: req.body.uname },
        { $set: { password: encpass } }
      );
      console.log(updateresult);
      if (updateresult.modifiedCount === 1) {
        res
          .status(200)
          .send({ statuscode: 1, msg: "Password changed successfully" });
      } else {
        res
          .status(200)
          .send({ statuscode: 0, msg: "Problem while changing password" });
      }
    } else {
      res
        .status(200)
        .send({ statuscode: 0, msg: "Current Password Incorrect" });
    }
  } else {
    res.status(200).send({ statuscode: 0, msg: "Username Incorrect" });
  }
} catch (e) {
  console.log(e);
  res.status(500).send({ statuscode: -1, msg: "Some error occured" });
}
}


async function resetPassController (req, res) {
  try {
const encpass = bcrypt.hashSync(req.body.newpass, 10);
var updateresult = await registerModel.updateOne(
  { username: req.body.uname },
  { $set: { password: encpass } }
);
console.log(updateresult);
if (updateresult.modifiedCount === 1) {
  res
    .status(200)
    .send({ statuscode: 1, msg: "Password changed successfully" });
} else {
  res
    .status(200)
    .send({ statuscode: 0, msg: "Problem while changing password" });
}
} catch (e) {
console.log(e);
res.status(500).send({ statuscode: -1, msg: "Some error occured" });
}
}

async function contactUs(req,res){
  const mailOptions = {
    from: "supermarket890@hotmail.com",
    to: "supermarket890@hotmail.com",
    subject: "Message from Website - Contact Us",
    text: `Name:- ${req.body.name}\nPhone:-${req.body.phone}\nEmail:-${req.body.email}\nMessage:-${req.body.msg}`,
  };

  // Use the transport object to send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send({ msg: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Message sent successfully" });
    }
  });
}


module.exports = {contactUs,resetPassController,changepasscontroller,deleteusercontroller,fetchusercontroller ,resetpassController,createUser, loginUser, loginAccount,LoginAdminAccount,fetchUserid ,searchUser}
