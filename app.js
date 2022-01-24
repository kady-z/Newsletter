const url = "https://us20.api.mailchimp.com/3.0/lists/89e9354490";
const listId = "89e9354490"; 

const options = {
    method: "POST"
}

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { dirname } = require('path/posix');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    let jsonData = JSON.stringify(data);

    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/html/success.html');
        } else {
            res.sendFile(__dirname + '/html/failure.html');
        }
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', function (req,res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 5000, function () {
    console.log("Server is running");
});
