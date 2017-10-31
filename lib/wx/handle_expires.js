
var  fio = require('./fileio');
var  wxrequest = require('./wxrequest');
var  convert = require('xml-js');

module.exports = {

	accessToken : function(cb) {
		var xml = fio.readConfig();
		var xjson = JSON.parse( convert.xml2json(xml, {
			compact: true,
			spaces: 4
		}) );
		var time = xjson.xml.access_token_ctime._text;
		var now = new Date().getTime();
		if(time != '' ){ time = parseInt(time); } else { time = 0; }
		if( now-time >= 7000*1000) {
			wxrequest.getAuthToken(process.env.appid, process.env.appsecret, function(d) {
				if(d && d.access_token){

					process.env.access_token= d.access_token;
						
					fio.saveAccessToken(d.access_token, now);
					cb();
				}
			});	
		}else {
			cb();
		}
	}	
}
