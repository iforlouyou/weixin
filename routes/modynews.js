var express = require('express');
var router = express.Router();
var wxrequest = require('../lib/wx/wxrequest');
var fileio = require('../lib/wx/fileio');
var handle_expires = require('../lib/wx/handle_expires');

router.get('/', function(req, res) {
	/* params
	*	media_id 必须 图文id
	*   index  必须  要更新在图文消息的位置，多图文消息时有意义第一篇为0 
	*	title  可选  标题
	*   thumb_media_id 可选  图文消息的封面图片素材 id
	*	author  可选  作者
	*	digest  可选  摘要
	*	show_cover_pic	可选	是否显示封面
	*	content	可选	图文内容
	*	content_source_url	可选	图文链接
	*/
	var media_id = req.query.media_id;
	var title, thumb_media_id, author, digest, show_cover_pic, content, content_source_url;
	var index;
	if(req.query.index) {
		index = req.query.index;
	}else {
		index = 0;
	}
	if(!media_id) {
		res.send("media_id参数不能为空");
		res.end();
		return;
	}
	var	t = fileio.readMaterial();
	var articles_id;
	var article;
	for(var o in t.news) {
		if(o.mediaid === media_id){
			articles_id = o.articles_id;
			article = ( t.articles[o.articles_id].articales )[index];
		}
	}
	if(!article) {
		res.send('media_id 无效 或者 index超出范围,请确认后在试');
		res.end();
		return;
	}
	if(req.query.title) {title = req.query.title; } else { title = article.title; }
	if(req.query.thumb_media_id) { thumb_media_id = req.query.thumb_media_id; } else { thumb_media_id = article.thumb_media_id; }
	if(req.query.author) { author = req.query.author; } else { author = article.author; }
	if(req.query.digest) { digest = req.query.digest; } else { digest = article.digest; }
	if(req.query.show_cover_pic) { show_cover_pic = req.query.show_cover_pic; } else { show_cover_pic = article.show_cover_pic; }
	if(req.query.conent) { content = req.query.content; } else { content = article.content; }
	if(req.query.content_source_url) { content_source_url = req.query.content_source_url; } else { content_source_url = article.content_source_url; }
	
	var json = {
		media_id : media_id,  //要修改的图片信息id
		index : index,  // 要更新在图文消息的位置，多图文消息时有意义第一篇为0
		articles : {
			title : title, //标题
			thumb_media_id : thumb_media_id, //图文消息的封面图片素材id
			author : author,  // 作者
			digest : digest, //摘要
			show_cover_pic : show_cover_pic, // 是否显示封面 0为false,不显示，1为true，显示
			content : content, // 图文消息的具体内容支持HTML标签，必须小于2万字符
			content_source_url : content_source_url //图文消息的原文地址
		}
	}
	handle_expires.accessToken(function() {
		wxrequest.modyNews(process.env.access_token, json, function(d) {
			if(!d.errmsg){
				( t.articles[articles_id].articales )[index] = json.articles;
				fileio.writeMaterial(t);	
			}
			res.send(d);
			res.end();
		});	
	});
});

module.exports = router;
