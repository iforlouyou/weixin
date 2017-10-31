var jsSHA = require('jssha');
var process = require('process');

module.exports = {

	verifyhttpsite : function(d){
		var myauthinfo = {
			token : (process.env.token).toString(), 
			timestamp : (d.timestamp).toString(), //时间戳
			nonce : (d.nonce).toString(),  //随机数,
		};
		if(!myauthinfo.timestamp && !myauthinfo.nonce) return false;
		var keys = Object.keys(myauthinfo);
		var arr = [];
		keys.forEach( function( key ){
			arr.push(myauthinfo[key]);
		});
		arr.sort();
		var str = arr.join('');
		var shaobj = new jsSHA('SHA-1', 'TEXT');
		shaobj.update(str);
		var hash = shaobj.getHash('HEX');

		if(hash == d.signature) {
			return true;
		}else {
			return false;
		}
	}	
};
