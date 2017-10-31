var fs = require('fs');
var path = require('path');

var paths = {
	config: path.resolve(__dirname, '../../config/appinfo.xml'),
	filepath: path.resolve(__dirname, '../../public/'),
	temfilelog: path.resolve(__dirname, '../../public/log/tmpfile.js'),
	reply_news : path.resolve(__dirname, '../../template/replay_news.json'),
	material : path.resolve(__dirname, '../../template/material.json')
};

var tmpfilelog = {
		name: '',
		type: '',
		media_id : '',
		spath: '',
		url: ''
};


module.exports = {
	readConfig : function(){
		var xml = fs.readFileSync(paths.config,'utf-8');
		return xml;
	},
	readReplyNews : function() {
		var json = fs.readFileSync(paths.reply_news, 'utf-8').trim();
		return JSON.parse( json );
	},
	readMaterial : function() {
		var json = fs.readFileSync(paths.material, 'utf-8').trim();	
		return JSON.parse( json );
	},
	writeMaterial : function(text) {
		fs.writeFile(paths.material, text, 'utf-8', (err) => {
			if(err) throw err;
			console.log('The file has been saved!');
		} );			
	},
	saveAccessToken : function(access_token, time){
		
		fs.open(paths.config, 'rs+', (err, fd) => {
				
			fs.readFile(paths.config,'utf8', (err, data) => {
				if(data){
					var start = data.indexOf('<access_token>')+14;
					var end = data.indexOf('</access_token>')-1;
					var start1 = data.indexOf('<access_token_ctime>')+20;
					var end1 = data.indexOf('</access_token_ctime>')-1;
					if(end>0){
						fs.writeSync(fd, access_token , start, end-start,start);
						fs.writeSync(fd, time, start1, end1-start1, start1);
						return 'success';
					}
				}else {
					return err; 
				}
			});

		});

	},
	saveTmpFileLog : function(fpath, type, media_id, cb){
			tmpfilelog['media_id'] = media_id;
			tmpfilelog['spath'] = fpath;
			tmpfilelog['name'] = path.basename(fpath);
			tmpfilelog['type'] = type;
			/**
			fs.writeFile(path.tmpfilelog, tmpfilelog, (err, data) => {
				
			});
			**/
			return cb('');
	}

};
