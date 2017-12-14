var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var Mail = require('../config/mail.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'HotelGuide Booking'});
});

/* GET contents */
router.get('/reply', function(req, res, next){
  // res.render('reply', {title: "Results Page"});
  var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('reply', {
            "collection" : docs
        });
    });
});

/* Testing mailer-> Sending an email */
// send mail with defined transport object
// var transporter = nodemailer.createTransport({
//  service: 'gmail',
//  auth: {
//         user: 'kgidion1@gmail.com',
//         pass: 'kalemera9209'
//     }
// });

// setup e-mail data with unicode symbols
// var options = {
//     to: 'kgidion1@hivetechug.com, obia.williams@gmail.com',
//     subject: 'Testing Nodemailer',
//     message: 'Hello, Finally Here .....'
// }

// var mail = new Mail({
//     to: options.to,
//     subject: options.subject,
//     message: options.message,
//     successCallback: function(suc) {
//         console.log('success');
//     },
//     errorCallback: function(err) {
//         console.log('error: ' + err);
//     }
// });

 var mailOpts, smtpTrans;

//Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
smtpTrans = nodemailer.createTransport({
    service: 'gmail',
    //  host:'smtp.gmail.com',
    //  port:465,
    // secure:true,
    auth: {
        user: "kgidion1@gmail.com",
        pass: "kalemera9209"
    }
});

var mailoutput = "<html>\n\
                        <body>\n\
                        <table>\n\
                        <tr>\n\
                        <td>Name: </td>Obia William<td></td>\n\
                        </tr>\n\
                        <tr>\n\
                        <td>Email: </td><td>obia.williams@gmail.com</td>\n\
                        </tr>\n\
                        <tr>\n\
                        <td>MN: </td>0757415220<td></td>\n\
                        </tr>\n\
                        <tr>\n\
                        <td>Messge: </td>Hello, Finally Here .....<td></td>\n\
                        </tr>\n\
                        </table></body></html>";

//Mail options
mailOpts = {
    to: "Hotel Guide <obia.williams@gmail.com>",
    subject: "Testing Nodemailer",
    html: mailoutput
};                        
// const mailOptions = {
//   from: 'kgidion1@gmail.com', // sender address
//   to: 'kgidion1@hivetechug.com, obia.williams@gmail.com', // list of receivers
//   subject: 'Testing Nodemailer', // Subject line
//   html: '<p>Hello ✔, <b>Finally Here</b></p>'// plain text body
// };

// var mailOptions = {
//     from: '"kgidion1" <kgidion1@gmail.com>', // sender address
//     to: 'kgidion1@hivetechug.com, obia.williams@gmail.com', // list of receivers
//     subject: 'Testing Nodemailer ', // Subject line
//     text: 'Hello world ?', // plaintext body
//     html: 'Hello ✔ <b>Hello world ?</b>' // html body
// };


// var transporter = nodemailer.createTransport('smtps://kgidion1@gmail.com:kalemera9209@smtp.gmail.com');
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         return console.log(error);
//     }
//     console.log('Message sent: ' + info.response);
// });

function sendEmail(id,subject,body,template,res){
    res.mailer.render(template, {
          to: id, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
          subject: subject, // REQUIRED. 
          body: body,
          otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
          }, function (err) {
          if (err) {
              res.send('Error'+err) ;
          }
          return;
          }
      );    
  }

/* POST to Add User Service */
router.post('/addcustomer', function(req, res, next) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var fullname = req.body.fullname;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var checkin_date = req.body.checkin_date;
    var checkout_date = req.body.checkout_date;
    var room_type = req.body.rooms;
    var pay = req.body.pay;
    var total_amount = req.body.amount;
    var current_date = req.body.current_date;

    // Set our collection
    var collection = db.get('usercollection');

    collection.find({check_in: checkin_date}, function(err, obj, header){
      if(err) res.send("There was an error");
      if(obj.length >= 1) {
        // res.redirect("index",{title: 'Home'})
        res.send("Sorry, we are already booked for that date ....");
        res.end();
        
      } else {
            // Submit to the DB
      collection.insert({
          "fullname" : fullname,
          "email" : email,
          "phonenumber": phonenumber,
          "check_in": checkin_date,
          "check_out" : checkout_date,
          "roomType": room_type,
          "payment method" : pay,
          "Amount": total_amount,
          "booking_date": current_date
      }, function (err, doc) {
          if (err) {
              // If it failed, return error
              res.send("There was a problem adding the information to the database. "+ err.message);
          }
          else {
              // And forward to success page
               smtpTrans.sendMail(mailOpts, function (error, res) {
                    if (error) {
                        // res.send("Email could not send due to error" +error);
                        return console.log(error);
                    }
                });

            //   sendEmail(email+',kgidion1@hivetechug.com,obia@hivetechug.com',
            //     'Password reset','Your Password is set to xxxxx. Please log in back.','email',res);
              // res.redirect('email',{title: "Email Success"});
                data = {'message': 'Booking successful !'}
              return res.send(data.message);
          }
      });
    }
    });
});

module.exports = router;
