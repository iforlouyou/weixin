var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');

router.get('/', function(req, res) {
	var code = req.query.code;
	wxrequest.getURLAuth(process.env.appid, process.env.appsecret, code, function(d) {
		res.json(d);
		res.end();
	});
});

module.exports = router;
