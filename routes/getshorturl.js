var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res) {
	var url = req.query.url;
	
	var json = {
		action : 'long2short',
		long_url : url+'#wechat_redirect',
	};
	handle_expires.accessToken(function() {
		wxrequest.getShortUrl(process.env.access_token, json, function(d) {
			res.send(JSON.stringify(d));
			res.end();
		});
	});
});

module.exports = router;
