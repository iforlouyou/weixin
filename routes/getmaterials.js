var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var process = require('process');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res, next) {
	var type = req.query.type;
	/*params 
	*  type  必须 素材类型(image, video, voice, news)
	*  offset 素材偏移位置
	*  count  素材数量 取值在1-20之间
	*/
	if(!type) {
		res.send('type参数不能为空(image,video,voice,news)');
		res.end();
		return;
	}
	var json = {
		type: type,
		offset: 0,
		count: 20
	};
	handle_expires.accessToken(function() {
		wxrequest.getMaterials(process.env.access_token, json, function(d) {
			res.send(d);
			res.end();
		});	
	});
});

module.exports = router;
