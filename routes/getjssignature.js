var express = require('express');
var router = express.Router();
var process = require('process');
var wxrequest = require('../lib/wx/wxrequest');
var  sign = require('../lib/wx/jssdk/sign');
var handle_expires = require('../lib/wx/handle_expires');

var apiList = ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice','chooseImage','previewImage','uploadImage','downloadImage','translateVoice','getNetworkType','openLocation','getLocation','hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem','closeWindow','scanQRCode','chooseWXPay','openProductSpecificView','addCard','chooseCard','openCard'];

router.get('/', function(req, res, next) {
});

router.post('/', function(req, res, next) {
	var body = req.body;
	if( !(process.env.apiticket) ){
		handle_expires.accessToken(function() {
			wxrequest.getJsApiTicket(process.env.access_token, function(json){
				if(json.ticket) {
					process.env.apiticket = json.ticket;
					var timestamp = sign.createTimestamp();
					var noncestr = sign.createNonceStr();
					var jsconfig = {
						debug: false,
						appId: process.env.appid,
						timestamp:	timestamp,
						nonceStr: noncestr,
						signature: sign.signature(json.ticket, timestamp, noncestr, body.url),
						jsApiList: apiList
					};
					res.json({status: 0, data: jsconfig});
				}else {
					res.json({status: json.errcode, msg: json.errmsg});	
				}
				res.end();

			});
		});

	}else {
		var timestamp = sign.createTimestamp();
		var noncestr = sign.createNonceStr();
		var jsconfig = {
			debug: true,
			appId: process.env.appid,
			timestamp:	timestamp,
			nonceStr: noncestr,
			signature: sign.signature(process.env.apiticket, timestamp, noncestr, body.url),
			jsApiList: apiList
		};
		res.json({status: 0, data: jsconfig});
	}
	
});

module.exports = router;
