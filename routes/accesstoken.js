var  express = require('express');
var  router = express.Router();
var  wxrequest = require('../lib/wx/wxrequest');
var  fio = require('../lib/wx/fileio');

router.get('/', function(req, res, next) {

	wxrequest.getAuthToken(process.env.appid, process.env.appsecret, function(d) {
		if(d && d.access_token){

			process.env.access_token= d.access_token;
			
			fio.saveAccessToken(d.access_token, new Date().getTime());	
		}
		res.json(d);
		res.end();
	});
	
});

module.exports = router;
