/*
router.get('/server', function(req, res, next) {


    var amount = req.query.amount; // GET THE AMOUNT FROM THE GET REQUEST

    var stripeToken = "CUSTOM_PAYMENT_TOKEN";

    var charge = stripe.charges.create({
        amount: 1100, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            res.json(err);   
        } else {
            res.json(charge);   
        }
    });
 
    console.log(req);
});
   */

var express = require('express');
var app = express();

app.post('/', function(req,res){
    console.log(req);
});