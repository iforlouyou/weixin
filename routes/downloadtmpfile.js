var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var process = require('process');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/',function(req, res, next) {
	var media_id = req.query.media_id;

	handle_expires.accessToken(function() {
		wxrequest.downloadTmpFile(process.env.access_token, media_id, function(json) {
			res.send(json);
			res.end();
		});
	});

});

module.exports = router;
