var path = require('path');
var wxrequest_api = require('node-weixin-request');


var basicurl = 'https://api.weixin.qq.com/cgi-bin/';
var burl = 'https://api.weixin.qq.com/sns/';
var kf_burl = 'https://api.weixin.qq.com/customservice/kfaccount/';

var urls = {

	tokenprex : basicurl +'token?grant_type=client_credential',
	srvipsrex : basicurl +'getcallbackip?access_token=',
	createmenuprex : basicurl + 'menu/create?access_token=',
	deletemenuprex : basicurl + 'menu/delete?access_token=',
	uploadtmpfileprex : basicurl + 'media/upload?access_token=',
	downloadtmpfileprex : basicurl + 'media/get?access_token=',
	uploadfileprex : {
		news: basicurl + 'material/add_news?access_token=', 
		news_img : basicurl + 'media/uploadimg?access_token=', 
		other : basicurl + 'material/add_material?access_token=',
	},
	downloadfileprex : basicurl + 'material/get_material?access_token=',
	modynewsprex : basicurl + 'material/update_news?access_token=',
	delmaterialprex : basicurl + 'material/del_material?access_token=',
	getmaterialsprex : basicurl + 'material/batchget_material?access_token=',
	getjsapi_ticketprex :  basicurl + 'ticket/getticket?access_token=',
	getqrcode_ticketprex : basicurl + 'qrcode/create?access_token=',
	getqrcodeprex : basicurl + 'showqrcode?ticket=',
	getwxuserinfoprex : basicurl + 'user/info?access_token=',
	getshorturlprex : basicurl + 'shorturl?access_token=',
	geturlauthprex : burl +'oauth2/access_token?appid=',
	addkfaccountprex : kf_burl + 'add?access_token=',
	sendkfmsgprex : basicurl + 'message/custom/send?access_token=',
};

var wxrequest = {

	getAuthToken : function(appid, appsecret, cb){
		var url = urls.tokenprex +'&appid='+ appid +'&secret='+appsecret;
		return this.httpResponse(url, {} , 'getAuthToken', cb);	
	},
	addKFAccount : function(access_token, body, cb) {
		var url = urls.addkfaccountprex +''+ access_token;
		return this.httpResponse(url, body, 'addKFAccount', cb);
	},
	sendKFMsg : function(access_token, body,  cb) {
		var url = urls.sendkfmsgprex +''+ access_token;
		return this.httpResponse(url, body, 'sendKFMsg', cb);
	},
	getJsApiTicket : function(access_token, cb) {
		var url = urls.getjsapi_ticketprex  +''+ access_token +'&type=jsapi';
		return this.httpResponse(url, {}, 'getJsApiTicket', cb);
	},
	getqrcode_ticket : function(access_token, body, cb) {
		var url = urls.getqrcode_ticketprex +''+ access_token;
		return this.httpResponse(url, JSON.stringify( body ), 'getQRcodeTicket', cb);	
	},
	getqroce : function(ticket,cb) {
		
	},
	getShortUrl : function(access_token, body, cb) {
		var url = urls.getshorturlprex +''+ access_token;
		return this.httpResponse(url, JSON.stringify( body ), 'getShortUrl', cb);
	},
	getURLAuth : function(appid, appsecret, code, cb) {
		var url = urls.geturlauthprex +''+ appid +'&secret='+ appsecret +'&code='+ code +'&grant_type=authorization_code';
		return this.httpResponse(url, {}, 'getURLAuth', cb);
	},
	getwxuserinfo : function(access_token, openid, cb){
		var url = urls.getwxuserinfoprex +''+ access_token +'&openid='+ openid +'&lang=zh_CN';
		return this.httpResponse(url,{}, 'getWXUserinfo', cb);
	},
	getSeverIPs : function(access_token, cb) {
		var url = urls.srvipsrex +''+ access_token;
		return this.httpResponse(url, {}, 'getServerIPs', cb);
	},
	getMaterials : function(access_token, body, cb) {
		var url = urls.getmaterialsprex +''+ access_token;
		return this.httpResponse(url, JSON.stringify( body ), 'getMaterials', cb); 
	},
	createMenu : function(access_token, text, cb) {
		var url = urls.createmenuprex +''+ access_token;
		return this.httpResponse(url, text, 'createMenu', cb);	
	},
	deleteMenu : function(access_token, cb) {

		var url = urls.createmenuprex +''+ access_token;
		return this.httpResponse(url, {}, 'deleteMenu', cb);	
	},
	uploadTmpFile : function(access_token, type ,fpath, cb) {

		var url = urls.uploadtmpfileprex +''+ access_token + '&type=' +type;
		var apath = path.resolve(__dirname, '../../public/'+fpath);
		wxrequest_api.file(url, apath, function(err, json) {
			return cb(json);
		});

	},
	uploadFile : function(access_token, type, fpath, articles,  cb) {
		var url;
		if(type == 'news') {

			url = urls.uploadfileprex.news +''+ access_token;

		}else if(type == 'news_img') {

			url = urls.uploadfileprex.news_img +''+ access_token;
			
		}else{

			url = urls.uploadfileprex.other +''+ access_token + '&type=' +type;
		}

		if(articles){
			return this.httpResponse(url, articles, 'news', cb);
		}else {
			var apath = path.resolve(__dirname, '../../public/'+ fpath);
			wxrequest_api.file(url, apath, function(err, json) {
				if(err)  return cb(err);		
				return cb(json);
			});	
		}
	
	},
	modyNews : function(access_token, body, cb) {
		var url = urls.modynewsprex +''+ access_token;
		return this.httpResponse(url, body, 'modyNews', cb);
	},
	delMaterial : function(access_token, body, cb) {
		var url = urls.delmaterialprex +''+ access_token;
		return this.httpResponse(url, JSON.stringify( body ) , 'delMaterial', cb);
	},
	downloadTmpFile : function(access_token, media_id, cb){

		var url = urls.downloadtmpfileprex +''+ access_token + '&media_id=' +media_id;
		return this.httpResponse(url, {}, 'downloadTmpFile', cb);

	},
	downloadFile : function(access_token, media_id, cb) {

		var url = urls.downloadfileprex + '' + access_token;
		return this.httpResponse(url, media_id, 'downloadFile', cb);

	},
	httpResponse : function(url, params, type, cb) {
		var self = this;
		wxrequest_api.request(url, params, function(err, json) {	
			if(!err) {
				/**
				if(json.errcode){
					if(json.errcode == 42001){
						self.getAuthToken(process.env.appid, process.env.appsecret,function(d) {
							process.env.access_token = d.access_token;
						});
					}
				}
				**/
				/*正常回调*/
				if(type == 'getAuthToken'){
					return cb(json);
				}else if(type == 'getJsApiTicket'){
					return cb(json);
				}else if(type == 'createMenu') {
					return cb(json);
				}else if(type == 'deleteMenu') {
					return cb(json);
				}else if(type == 'downloadTmpFile') {
					var download_url = json.video_url;
					wxrequest_api.download(url, {hel: ''}, download_url, function(err,json){
						return cb(json);	
					});
				}else if(type == 'modyNews'){
					return cb(json);
				}else if(type == 'delMaterial'){
					return cb(json);
				}else if(type == 'downloadFile') {
					return cb(json);	
				}else if(type == 'news'){
					return cb(json);
				}else if(type == 'getMaterials') {
					return cb(json);	
				}else if(type == 'getQRcodeTicket'){
					return cb(json);
				}else if(type == 'getWXUserinfo') {
					return cb(json);
				}else if(type == 'getShortUrl') {
					return cb(json);
				}else if(type == 'getURLAuth'){
					return cb(json);
				}else if(type === 'addKFAccount'){
					return cb(json);
				}else if(type === 'sendKFMsg') {
					return cb(json);
				}

			}else {
				var errcode = json.errcode;
				var errmsg = json.errmsg;
				return cb(json);
			}
		});
	} 	
};

module.exports = wxrequest;
