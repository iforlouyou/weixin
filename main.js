
var wxrequest = require('./lib/wx/wxrequest');
var  convert = require('xml-js');
var  process = require('process');
var  fio = require('./lib/wx/fileio');


var main = function() {

	var xml = fio.readConfig();
	var xjson = JSON.parse( convert.xml2json(xml, {
		compact: true,
		spaces: 4
	}) );
	
	process.env.appid= xjson.xml.appid._text;
	process.env.appsecret= xjson.xml.appsecret._text;
	process.env.access_token= xjson.xml.access_token._text;
	process.env.expires_in= xjson.xml.expires_in._text;
	process.env.token =  xjson.xml.token._text;
	process.env.wxpubacc = xjson.xml.wxpubacc._text;	
/**
	setImmediate(function(){
		wxrequest.getAuthToken(process.env.appid, process.env.appsecret, function(d) {
			if(d && d.access_token){

				process.env.access_token= d.access_token;
				var access_token = d.access_token;
				console.log(d.access_token +'--'+ access_token.length);
				fio.saveAccessToken(d.access_token);
			}
		});
	});
**/
/**
	setInterval(function(){
		wxrequest.getAuthToken(process.env.appid, process.env.appsecret, function(d) {
			if(d && d.access_token){

				process.env.access_token= d.access_token;
				fio.saveAccessToken(d.access_token);
			}
		});
	}, 6000*1000);
**/
/**
	var rl = readline.createInterface({
		input: fs.createReadStream('./xml/appinfo.xml'),
	});
	rl.on('line', (line)=> {
		console.log('---'+line +'\n');
		var n;
		if((n= line.indexOf('</access_token>'))!= -1) {
					
		}
	});
**/
/**
	wxrequest.getAuthToken(appinfo_test.id, appinfo_test.secret, function(d) {
		if(d){
			appinfo_test['token'] = d.access_token;
			//wxconfig_api.app.init(appinfo_test);
			console.log(d.access_token);
			var menu = {
				'button': [
					{
						'type': 'view',
						'name': '我要',
						'url': 'http://baidu.com'
					}
				]
			};
			wxrequest.createMenu(d.access_token, menu, function(d) {
				console.log(JSON.stringify(d));
				if(errcode == 0){
					console.log('----菜单创建成功');
				}else {
					console.log('error ---'+d.errmsg);
				}
			});
		}
	
	});
**/
};
module.exports = main;
