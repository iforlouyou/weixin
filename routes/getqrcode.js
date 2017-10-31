var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var sign = require('../lib/wx/jssdk/sign');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res) {

	var json = {
		expire_seconds : 3600,
		action_name: 'QR_STR_SCENE',
		action_info: {
			scene : {
				scene_str: 'link',
			},
		}
	};
	handle_expires.accessToken(function() {
		wxrequest.getqrcode_ticket(process.env.access_token, json, function(d) {
			res.send(d);
			res.end();
		});
	});

	
});

module.exports = router;
