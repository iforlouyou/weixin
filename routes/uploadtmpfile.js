var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var process = require('process');
var fio = require('../lib/wx/fileio');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res, next) {
	/*params
	* path --上传临时文件路径
	* type --上传文件类型(image, voice, video, thumb)
	*/
	var fpath = req.query.path;
	var type = req.query.type;
	handle_expires.accessToken(function() {
		wxrequest.uploadTmpFile(process.env.access_token, type, fpath, function(d) {
			if( !d.errcode ){
				fio.saveTmpFileLog(fpath, type, d.media_id, function(msg){
					if(msg){
						console.log('tmpfile save success');	
					}
				});	
				res.json(d);
			}else {
				res.json(d);
			}
			res.end();
		});	
	});	
});

module.exports = router;
