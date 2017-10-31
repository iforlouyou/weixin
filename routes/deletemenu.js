var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var process = require('process');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res, next) {
	
	handle_expires.accessToken(function() {
		wxrequest.deleteMenu(process.env.access_token, function(d) {
			if(d){
				res.send({status: d.errcode,msg: d.errmsg});
			}
			res.end();
		});
	});

});

module.exports = router;
