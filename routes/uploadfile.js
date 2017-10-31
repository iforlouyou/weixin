var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var	process = require('process'); 
var fileio = require('../lib/wx/fileio');
var Path = require('path');
var handle_expires = require('../lib/wx/handle_expires');


router.get('/', function(req, res, next) {
	
	/*params
	* type  --  必须 上传类型 news(图文), image,voice,video,thumb
	* path  --  必须 type=news path默认为 template/material.json 上传文件的路径
	* remark -- 可选 用于文件的别名描述
	* articles_index 必须 interger  默认为0  用于选择articles模板元素的位置(template/material.json)
	*/
	var path = req.query.path;
	var type = req.query.type;
	if(type == 'news') path = 'template/material.json'; 
	var remark = '';
	var articles_index = 0;
	if(req.query.remark) remark = req.query.remark;
	if(req.query.articles_index)  articles_index = parseInt( req.query.articles_index ); 	
	if(!type) {
		res.send('上传的类型不能为空(news,image,voice,video,thumb)');
		res.end();
		return;
	}

	var articles;
	if(type == 'news') {
		var o = {
			articles : []
		};
		o['articles'] = (fileio.readMaterial().articles)[articles_index].articles;
		articles = JSON.stringify( o );
		//console.log(articles);
	}else {
		if( type != 'image' && type != 'voice' && type != 'video' && type != 'thumb' && type != 'news_img') {
			res.json({
				status : 4001,
				msg : {
					err : '上传文件类型不对',
					correct :  'type = (news, image, voice, video, thumb)'
				}
			});
			res.end();
			return;
		}
		if(!path) {
			res.send('文件路径或者图文的配置路径不能为空');
			res.end();
			return;
		}
		articles = null;	
	}

	if(!articles) {
		res.send('articles_index 超出数组范围,请重新填写');
		res.end();
		return;
	}

	handle_expires.accessToken(function() {
	
		wxrequest.uploadFile(process.env.access_token, type, path, articles,  function(d) {
			var json = fileio.readMaterial();
			var a = json.mediaids;
		
			if(d.media_id && d.url){
				/*处理image,voice,video,thumb,news, news_img*/
				var o = {
					mediaid : d.media_id,
					name : Path.basename(path),
					path : path,
					url : d.url,
					remark : remark
				}
				if( type === 'image'){
					a.images.push( o );
					(json.mediaids)['images'] = a.images;	
				}else if( type === 'voice'){
					a.voices.push( o );
					(json.mediaids)['voices'] = a.voices;	
				}else if( type === 'video' ) {
					a.videos.push( o );
					(json.mediaids)['videos'] = a.videos;	
				}else if( type === 'thumb' ) {
					a.thumbs.push( o );
					(json.mediaids)['thumbs'] = a.thumbs;	
				}

			}else if(!(d.media_id) && d.url ){
				/*处理图文中的图片*/
				var o = {
					url : d.url,
					name : Path.basename(path),
					path : path,
					remark : remark
				};
				a.news_imgs.push( o );
				(json.mediaids)['news_imgs'] = a.news_imgs;	
			}else if(!(d.url) && d.media_id ){
				/*处理图文信息*/
				var o = {
					mediaid : d.media_id,
					remark : remark,
					articles_index : articles_index
				};
				a.news.push( o );
				(json.mediaids)['news'] = a.news;	
			}else{
				res.send(d);
				res.end();
				return;
			}
			console.log(json);		
			fileio.writeMaterial( JSON.stringify(json) );
			res.send(d);
			res.end();
		});
	});
});

module.exports = router;
