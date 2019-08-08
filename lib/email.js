'use strict';
const nodemailer = require('nodemailer');
//var MongoClient = require('mongodb').MongoClient;
var _email_settings=
{
	smtp_host:"smtp.gmail.com",
	smtp_port:"587",
	smtp_secured:"No",
	username:"cpoemhi@gmail.com",
	password:"abcD5####",
	emails:["gerbis2000@gmail.com"]
}

exports.sendEmail= function sendEmail (subject,text,listEmails,email_settings,callback){

      nodemailer.createTestAccount((err, account) => {
		  //console.log(email_settings);
		  var smtp_host = email_settings.smtp_host
          var smtp_port = email_settings.smtp_port
          var smtp_secured = email_settings.smtp_secured
          var username = email_settings.username
          var password = email_settings.password
          if(smtp_secured == "No")
          smtp_secured = false
          else
          smtp_secured = true
          var emails =email_settings.emails;
          //var to = emails.join(",")
          var to = listEmails.join(",")
          //console.log(smtp_host + " "+ smtp_port + " "+ smtp_secured + " "+ username + " "+ password + " "+ to)
          let transporter = nodemailer.createTransport({
              host: smtp_host,
              port: smtp_port,
              secure: smtp_secured,
              auth: {
                  user: username,
                  pass: password
              }
          });

          let mailOptions = {
              from: '"OpenLMIS-Moodle Training plateform" <cpoemhi@gmail.com>',
              to: to,
              subject: subject,
              //text: text,
               html:text
          };
          //console.log(mailOptions)
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.log(error);
                  return callback(false)
              }
              return callback(true);
          });
      });
    }

