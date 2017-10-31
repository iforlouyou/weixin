var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');

router.get('/', function(req, res) {
	var json = {
		kf_account: 'iforlouyou@'+process.env.wxpubacc,
		nickname : '客服1',
		//password : '',
	};
	wxrequest.addKFAccount(process.env.access_token, json, function(d) {
		res.send(d);
		res.end();
	});	
});

module.exports = router;
