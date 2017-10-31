var express = require('express');
var router = express.Router();
var fileio = require('../lib/wx/fileio');
var wxrequest = require('../lib/wx/wxrequest');
var handle_expires = require('../lib/wx/handle_expires'); 

router.get('/', function(req, res) {
	/*params
	* media_id 素材的id
	*/
	var media_id = req.query.media_id;
	if(!media_id) {
		res.send('media_id 参数不能为空');
		res.end();
		return;
	}
	var json = {
		media_id : media_id
	};

	handle_expires.accessToken(function() {
		wxrequest.delMaterial(process.env.access_token, json, function(d) {
			if(d.errcode == 0){
				var o = fileio.readMaterial().mediaids;
				for(var key  in o) {
					var arr = o[key];
					for(var i=0 ;i<arr.length; i++) {
						var obj = arr[i];
						if(obj.mediaid == media_id) {
							arr.splice(i,1);
							break;
						}
						i++;
					}
				}
				console.log(object);
				fileio.writeMaterial(o);		
			}
			res.send(d);
			res.end();
		});
	});	

});

module.exports = router;
