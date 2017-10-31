var wxrequest = require('./wxrequest');
var dbapi = require('../dbapi'); 
var fileio = require('./fileio');

var wxmessage_api = require('node-weixin-message');
var messages = wxmessage_api.messages;
var reply = wxmessage_api.reply;


module.exports = {
	autoReplyMsg : function(d) {
		if(d.reply_type == 'news'){

			var json = fileio.readReplyNews();
			if( typeof json ===  'object' ){
				console.log(json);
			}else {
				console.log('json parse error');
			}
			var a = [];
			a.push(json.news.test1);	
			var xml = reply.news(d.tousername, d.fromusername,a);
			return xml;

		}else if(d.reply_type == 'text') {

			var str = '您好，有什么需要帮忙的?';
			var text = reply.text(d.tousername, d.fromusername, str);
			d['msg'] = str; //这里需要智能筛选数据	 
			dbapi.saveChatMsg(d, function(data) {
				if( data.status !=0 ){
					console.log('db error---'+data.msg);
				}	
			});  //保存聊天信息
			return  text;

		}else if(d.reply_type == 'image') {

			var json = fileio.readMaterial();
			var images = json.mediaid.images;
			/*智能筛选回复*/
			/**
			for( var obj in images) {
				if((obj.remark).contains(''))
			}
			**/
			var mediaid = images[0].mediaid;
			var image = reply.image(d.tousername, d.fromusername, mediaid);
			return image;
		}else if(d.reply_type == 'video') {
			return '';	
		}else if(d.reply_type == 'music') {
			return '';
		}
	},
	autoReplyVideo : function(d) {
	
	},
	autoReplyPic : function(d) {
	
	},
	autoReplyVoice : function(d) {
	
	},
	autoReplyShortVideo : function(d) {
	
	},
	handleLocationInfo : function(d) {	
	
	},
	handleLinkInfo : function(d) {
	
	},
	handleViewEvent : function(d) {
				
	},
	handleClickEvent : function(d) {
	
	},
	handleScanEvent : function(openid, d) {
		var secenstr = (d.eventkey)[0];	
		if(secenstr == 'link'){
			return 'http://wx.lifestyles.com.cn/index.html';
		}
		/**
		console.log('---------handleScanEvent-----------');	
		wxrequest.getwxuserinfo(process.env.access_token,openid, function(dt) {
			var  myjson = {
				openid : openid,
				source : 'wxscan'
			};
			dbapi.login(myjson, dt);	
		});
		**/
	}
};
