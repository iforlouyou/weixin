var express = require('express');
var router = express.Router();
var process = require('process');
var wxrequest = require('../lib/wx/wxrequest');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res, next) {
	var media_id = req.query.media_id;
	handle_expires.accessToken(function() {
		wxrequest.downloadFile(process.env.access_token, media_id, function(d) {
			if(!d.errcode){
				if(d.title){
					//处理视频素材
				}else if(d.news_item){
					//处理图文素材
				}
			}
			res.send(d);
			res.end();
		});
	
	});
});

module.exports = router;
