const resetpassModel = require("../models/resetpassModel");

async function resetpass(req, res) {
  const resetdata = await resetpassModel.findOne({ token: req.query.token });
  if (!resetdata) {
    return res.send({ statuscode: -1, msg: "Invalid reset link. Try Again" });
  } else {
    console.log(resetdata);
    var exptime = new Date(resetdata.exptime); //Thu Apr 25 2024 11:17:22 GMT+0530 (India Standard Time)
    var currenttime = new Date(); //Thu Apr 25 2024 11:11:22 GMT+0530 (India Standard Time)

    if (currenttime < exptime) {
      res.send({ statuscode: 1, username: resetdata.username });
    } else {
      return res.send({
        statuscode: 0,
        msg: "Link Expired. It was valid for 15 mins only. Request new link",
      });
    }
  }
}

module.exports = { resetpass };
