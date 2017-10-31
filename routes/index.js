var express = require('express');
var router = express.Router();
var recmsghandle = require('../lib/wx/recmsghandle');
var srvauthhandle = require('../lib/wx/srvauthhandle');
var parser = require('xml-js');

var events = {
	EVENT_SUBSCRIBE : 'subscribe', //订阅时的事件推送
	EVENT_UNSUBSCRIBE: 'unsubscribe', //取消订阅时的事件推送
	EVENT_SCAN: 'SCAN',  //扫描二维码的事件推送
	EVENT_LOCATION: 'LOCATION', //发送位置的事件推送
	EVENT_CLICK: 'CLICK', //点击菜单拉取消息时的事件推送
	EVENT_VIEW: 'VIEW' , //点击菜单跳转链接时的事件推送
	EVENT_TEMPLATE: 'TEMPLATE' //处理模板消息发送事件----待查询
}

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	var myauthinfo = {
		signature : '', //ssa-1 hash算法(token,timestamp,nonce字典排序的字符串)
		timestamp : 0, //时间戳
		nonce : 0,  //随机数,
		echostr : ''
	};
	myauthinfo.signature = req.query.signature;
	myauthinfo.timestamp = req.query.timestamp;
	myauthinfo.nonce = req.query.nonce;
	myauthinfo.echostr = req.query.echostr;
	/*验证数据来自于微信后台*/
	var  b = srvauthhandle.verifyhttpsite(req.query);
	if(b){
		res.send(myauthinfo.echostr);
	}else{
		res.send('');
		console.log('debug : ---消息非来源于微信' );
	}
	res.end();
});

router.post('/', function(req, res, next) {
	if(req.get('content-type') == 'text/xml') {
	
		/*验证http来源*/
		var  b = srvauthhandle.verifyhttpsite(req.query);
		
		console.log(JSON.stringify(req.body.xml));	
		
		/*所有的微信响应参数集合*/
		var restextinfo = {
			tousername : (req.body.xml.tousername)[0],
			fromusername : (req.body.xml.fromusername)[0],
			createtime : (req.body.xml.createtime)[0],
			msgtype : (req.body.xml.msgtype)[0],
			openid : req.query.openid,
			timestamp : req.query.timestamp
		};

		if(b){
			/*自动回复微信用户信息*/
			switch(restextinfo.msgtype) { 
				case 'text':
					restextinfo['msgid'] = (req.body.xml.msgid)[0];
					restextinfo['content'] = (req.body.xml.content)[0];
					restextinfo['reply_type'] = 'text';
					var xml = recmsghandle.autoReplyMsg(restextinfo);
					/**
					var time = Math.ceil( ( new Date().getTime() )/1000 );
					var a = {'ToUserName': {'_cdata': restextinfo.fromusername},'FromUserName':{'_cdata': restextinfo.tousername}, 'CreateTime': {'_cdata': time}, 'MsgType': {'_cdata': 'text'}, 'Content': {'_cdata': text} };
					console.log(a);
					var xml = parser.json2xml(a, {
						spaces : 0,
						compact : true,
						indentCdata : true,
						fullTagEmptyElement: true
					});
					res.set('Content-Type', 'text/xml');
					res.send(xml);
					/**/
					res.send(xml);
					
					break;
				case 'video':
					restextinfo['mediaid'] = (req.body.xml.mediaid)[0];
					restextinfo['thumbmediaid'] = (req.body.xml.thumbmediaid)[0];
					
					recmsghandle.autoReplyVideo(resttextinfo);
					res.send('success');
					break;
				case 'shortvideo':
					restextinfo['mediaid'] = (req.body.xml.mediaid)[0];
					restextinfo['thumbmediaid'] = (req.body.xml.thumbmediaid)[0];
					recmsghandle.autoReplyShortVideo(restextinfo);
					res.send('success');
					break;
				case 'image': 
					restextinfo['picurl'] = (req.body.xml.picurl)[0];
					restextinfo['mediaid'] = (req.body.xml.mediaid)[0];
					
					recmsghandle.autoReplyPic(resttextinfo);
					res.send('success');
					break;
				case 'voice': 
					restextinfo['mediaid'] = (req.body.xml.mediaid)[0];
					restextinfo['format'] = (req.body.xml.format)[0];

					recmsghandle.autoReplyVoice(restextinfo);
					res.send('success');
					break;
				case 'location' :
					restextinfo['location_x'] = (req.body.xml.location_x)[0];
					restextinfo['location_y'] = (req.body.xml.location_y)[0];
					restextinfo['scale'] = (req.body.xml.scale)[0];
					restextinfo['label'] = (req.body.xml.label)[0];

					recmsghandle.handleLocationInfo(restextinfo);
					res.send('success');
					break;
				case 'link':
					restextinfo['title'] = (req.body.xml.title)[0];
					restextinfo['description'] = (req.body.xml.description)[0];
					restextinfo['url'] = (req.body.xml.location_x)[0];
					
					recmsghandle.handleLinkInfo(restextinfo);
					res.send('success');
					break;
				case 'event':
					/*处理事件推送*/
						
					var evt = (req.body.xml.event)[0];
					if(evt == events.EVENT_VIEW) {
						var eventkey = (req.body.xml.eventkey)[0];
						/*链接微信服务器,自动跳转,这里主要是接受event，获取用户信息*/
						recmsghandle.handleViewEvent(req.body.xml);
						res.send('success');
					}else if(evt == events.EVENT_CLICK){
					}else if(evt == events.EVENT_SCAN ){
						//recmsghandle.handleScanEvent(restextinfo.openid,req.body.xml);	
						res.send('success');	
					}else if(evt == events.EVENT_SUBSCRIBE){
						res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+process.env.appid+'&redirect_uri='+'http%3a%2f%2fwx.lifestyles.com.cn%2findex.html'+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect');					
					}
					break;
				default:
					break;	
			}


		}else{
			console.log('debug : --请求非来源于微信');
			res.send('success');
		}

	}else {
		console.log('debug : ---数据非xml数据');
		res.send('success');
	}
	res.end();
});

module.exports = router;
