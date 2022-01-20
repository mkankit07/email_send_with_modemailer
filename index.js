require('dotenv').config()
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const port = 4000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var to;
var subject;
var body;
var path;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback){
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single('image');



app.post("/sendemail", (req, res) => {
  upload(req, res, function(err){
    if (err) {
      console.log(err);
      return res.end("Something went wrong ");
    }else{
      to = req.body.to;
      subject = req.body.subject;
      body = req.body.body;
      path = req.file.path;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:process.env.user,
          pass:process.env.pass,
        } 
      });
      var mailOptions = {
        from:process.env.form_user,
        to: to,
        subject: subject,
        text: body,
        attachments: [
          {
            path: path
          }
        ]
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Emial sent " + info.response);
          fs.unlinkSync(path);
          return res.redirect("/result.html");
        }
      });
    }
  });
}); 

app.listen(port, () => {
  console.log("App started on port 4000");
});
