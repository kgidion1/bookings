var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail', //example
    auth: {
       user: 'kgidion1@gmail.com',
        pass: 'kalemera9209'
    }
});

module.exports = function(params) {
    this.from = 'kgidion1@gmail.com';

    this.send = function(){
        var options = {
            from : this.from,
            to : params.to,
            subject : params.subject,
            text : params.message
        };

        transporter.sendMail(options, function(err, suc){
            err ? params.errorCallback(err) : params.successCallback(suc);
        });
    }
}