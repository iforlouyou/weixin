var express = require('express');
var router = express.Router();
var	dbapi = require('../../lib/dbapi'); 
var crypto = require('crypto');

router.post('/', function(req, res) {
	
	var name = req.body.uname;
	var	pwd = req.body.pwd; 
	var time = req.body.time;
			
	dbapi.register(req.body, function(d) {
		res.send(d);
		res.end();
	});
});

module.exports = router;
