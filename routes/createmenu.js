var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var process = require('process');
var fs = require('fs');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res, next) {
	var menu = fs.readFileSync('template/app_menu1.json', 'utf-8');	

	handle_expires.accessToken(function() {
		wxrequest.createMenu(process.env.access_token, menu, function(d) {
			if(d) {
				res.json({status: d.errcode,msg: d.errmsg});
			}
			res.end();
		});
	});

});

module.exports = router;
