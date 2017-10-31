var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var params = req.query;
	console.log(req.query.openid);
	switch( params.type) {
		case 'test':
			// res.redirect('/page');	
			break;
		case 'test1':
			break;
		default:
			break;
	}
	res.end();
});

router.post('/', function(req, res, next) {
	res.end();
});

module.exports = router;
