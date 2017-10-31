/**
var promise = require('bluebird');
var options = {
	promiseLib: promise
}
**/
var pgp = require('pg-promise')();
var db = pgp('postgre://ztxkdb:1234509876@localhost:5432/ztxkdb');
var crypto = require('crypto');
var sign = require('./wx/jssdk/sign');

var source_type = ['wxscan','login'];

var sql = {
	searchWXUserBywid : 'select * from wxuser where wid=$1',
	searchWXUser : 'select * from wxuser',
	insertWXUser : 'insert into  wxuser(wid,nickname,country,province,city,headimgurl,subscribe_time,remark,groupid,tagid_list) values(${openid},${nickname},${country},${province},${city},${headimgurl},${subscribe_time},${remark},${groupid},${tagid_list}) returning *',
	insertAPPWXUser : 'insert into app_wx_user(uid,wid) values($1,$2)',
	insertAPPUser : 'insert into appuser(uid,name,nickname,pwd,email,phone,address,icon,ctime) values(${uid},${name},${nickname},${pwd},${email},${phone},${address},${icon},${ctime}) returning *',
	insertchat : 'insert into chat(rid,touser,fromuser,msg,ctime) values($(rid), $(touser), $(fromuser), $(msg), $(ctime) )',
	insertReplyMsg : 'insert into replymsg(media_id, content, template,  detail, ctime) values($(media_id), $(content), $(template), $(detail), $(ctime) ) returning *'
};


var dbapi = {
	saveChatMsg : function(params, cb) {
		var obj = {
			media_id : function(){if(params.media_id){return params.media_id;}else{return null;}},
			content : function(){if(params.msg){return params.msg;}else{return null;}}, 
			template : function(){if(params.template){return params.template;}else{return null;}}, 
			detail : function(){if(params.detail){return params.detail;}else{return '';}},
			ctime : function() { return new Date(); } 	
		};
		db.one(sql.insertReplyMsg, obj)
		.then( (data) => {
			var obj = {
				rid : data.id,
				touser : params.tousername,
				fromuser : params.fromusername,
				msg :  function(){if(params.content){return params.content;}else{return '';}},
				ctime : function() { return new Date(); }
			};
			db.none(sql.insertchat, obj);	
			return cb({status: 0 ,msg: 'success'});
		})
		.catch( (err) => {
			return cb({status: -1, msg: err});
		});
				
	}, 
	register : function(params, cb) {
		var appuser = createAPPUser(params);
		db.query(sql.insertAPPUser, appuser)
		  .then( (data) => {
			return cb({status: 0, data: data}); 
		  })
		  .catch( (error) => {
		  	return cb({status: -1, msg: error});	 
		  });
	},
	login : function( json ,params, cb) {
		var data = params;
		if(json.source == source_type[0]) {

			db.query(sql.searchWXUserBywid, json.openid)
			  .then((data)=> {

					if( data.length==0 ){
						console.log(params.tagid_list);
						params['tagid_list'] = (params.tagid_list).join();
						params['openid'] = json.openid;
						
						var appuser = createAPPUser(params);
						
						db.tx(t=> {
							var a=[
								t.one(sql.insertWXUser, params),
							    t.one(sql.insertAPPUser, appuser)
							];
							return t.batch(a);
						})
						.then(data=> {
							 console.log('batch: ---' +JSON.stringify(data));
						 	 //db.none(sql.insertAPPWXUser, );	
						})
						.catch(error=> {
							console.log(error);
						});
						var result = db.query(sql.insertWXUser, params);
						console.log(sql.insertWXUser);
					}
			  })
			  .catch((error=> {
			  	console.log(error); 
			  }));
			//查找userinfo的openid是否存在,否则创建，写入中间表,自动创建用户身分，存在则 检查有几个账号，选择登录	
		}else if(json.source == source_type[1]){
			//主要是选择是否绑定微信	
		}		
	},
};

var createAPPUser = function(d) {
	var name, uid, pwd, email, phone, address, icon, ctime, nickname;
	if(d.email) { email = d.email; } else { email = ''; }
	if(d.phone) { phone = d.phone; } else { phone = ''; }
	if(d.address) { address = d.address; } else { address = ''; }
	if(d.nickname) { nickname = d.nickname; } else { nickname = ''; }
	if(d.name) { name = d.name; } else { name = nickname; }
	if(d.icon || d.headimgurl) { icon = ( d.icon ? d.icon : d.headimgurl );  } else { 
		icon = 'public/images/headimg/default.png'; //默认icon	
	}
	if(d.pwd) { 
		pwd = crypto.createHash('md5')
					.update(d.pwd)
					.digest('hex');
	}else {
		var s = sign.createNonceStr();
		pwd = crypto.createHash('md5')
					.update(s)
					.digest('hex');
	}
	/*uid hash算法ssh1加密 nonceStr,timestamp,name拼在一起*/
	var  s = sign.createNonceStr() + sign.createTimestamp() + name;
	var  uid = crypto.createHash('sha1')
		  .update(s)
		  .digest('hex');
	ctime = new Date();
	var obj = {
		uid: uid,
		name: name,
		nickname: nickname,
		pwd: pwd,
		email: email,
		phone: phone,
		address: address,
		icon: icon,
		ctime: ctime
	};
	return obj;
};


module.exports = dbapi;
