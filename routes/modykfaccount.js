var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');

router.get('/', function(req, res) {
	var  json = {
	};
	wxrequest.modyKFAccount(process.env.access_token, json, function(d) {
		res.send(d);
		res.end();
	});	
});

module.exports = router;
