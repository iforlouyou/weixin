
var _MAXAGE = 10*60*1000;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var qrcode = require('qrcode-js');
var xmlparser = require('express-xml-bodyparser');

var main = require('./main')();
var index = require('./routes/index');
var getacstoken = require('./routes/accesstoken');
var page = require('./routes/page');
var createmenu = require('./routes/createmenu');
var deletemenu = require('./routes/deletemenu');
var uploadtmpfile = require('./routes/uploadtmpfile');
var uploadfile = require('./routes/uploadfile');
var downloadtmpfile = require('./routes/downloadtmpfile');
var downloadfile = require('./routes/downloadfile');
var getmaterials = require('./routes/getmaterials');
var getjssignature = require('./routes/getjssignature');
var getqrcode = require('./routes/getqrcode');
var login = require('./routes/page/login');
var register = require('./routes/page/register');
var getshorturl = require('./routes/getshorturl');
var geturlauth = require('./routes/geturlauth');
var addkfaccount = require('./routes/addkfaccount'); //多客服升级成新版客服功能（需要在相关页面升级网址： https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1464266075&version=12&lang=zh_CN）
var modynews = require('./routes/modynews');
var delmaterial = require('./routes/delmaterial');

//var modykfaccount = require('./routes/modykfaccount');
//var removekfaccount = require('./routes/removekfaccount');
//var setkfheadimg = require('./routes/setkfheadimg');
//var getkfaccounts = require('./routes/getkfaccounts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json('application/json'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());
//app.use(cookieParser());

/*session 管理*/
var pg = require('pg');
var pgpool = new pg.Pool({
	database : 'ztxkdb',
	user : 'ztxkdb',
	password : '1234509876',
	port : 5432,
	ssl : true
});
var pgSession = require('connect-pg-simple')(session);
var store = new pgSession({
	pool : pgpool
});

app.use(session({
	secret: 'secret',
	/**
	genid: function(req) {
		return  uid.sync(18);
	},
	saveUninitialized: true,
	**/
	store: store,
	saveUninitialized : true,
	resave : false,
	cookie : {
		maxAge: _MAXAGE,
		secure: true
	}
}));

app.use(express.static(path.join(__dirname, 'public')));


/*路由*/
	/*-----------被动接受微信客户端消息---------------------*/
app.use('/wx', index);  //处理微信响应

	/*-----------管理客户端界面接口---------------------------------*/
app.use('/accesstoken', getacstoken); //得到access_token
app.use('/createmenu', createmenu);	//创建自定义menu
app.use('/deletemenu', deletemenu); //删除自定义menu
app.use('/page', page);  //页面跳转
app.use('/uploadtmpfile', uploadtmpfile); //上传临时文件，存放3天
app.use('/uploadfile', uploadfile);  //上传永久文件，最多能放5000个图片，别的1000个
app.use('/modynews', modynews); //修改永久文件
app.use('/delmaterial', delmaterial); //删除永久性素材
app.use('/downloadtmpfile', downloadtmpfile); //下载临时文件
app.use('/downloadfile', downloadfile); //下载永久文件
app.use('/getmaterials', getmaterials); //得到永久文件列表
app.use('/getqrcode', getqrcode);   //生成公众号的二维码 ticket,通过连接http://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=* 来获取公众号二维码
app.use('/getshorturl', getshorturl); // 长连接转成短连接，从而生成自己的二维码的url连接
app.use('/geturlauth', geturlauth); //网页的授权验证
app.use('/addkfaccount', addkfaccount); //添加客服账号(每个公众号最多添加10个客户账号)
//app.use('/modykfaccount', modykfaccount); //修改客服账号
//app.use('/removekfaccount', removefuaccount); //删除客服账号
//app.use('/setkfheadimg', setkfheadimg);  //修改客户头像
//app.use('/getkfaccounts', getkfaccounts); // 获取所有客服账号
//app.use('/sendkfmsg', sendkfmsg); //发送客服消息(文字,图文,视频,音乐,图片,卡劵,语音)


	/*----------客户端调用微信客户端jssdk的接口-------------------*/
app.use('/getjssignature', getjssignature);
	/*----------数据库业务逻辑接口*/
app.use('/page/register', register);
app.use('/page/login', login);
app.get('/test', function(req, res){
	store.set(req.sessionID, { cookie: {maxAge: _MAXAGE } },function(err) {
		res.send(req.sessionID);
	});
});
app.get('/qrcode_login',function(req, res) {
	var url = 'http://wx.lifestyles.com.cn/';
	var base64 = qrcode.toDataURL(url, 4);
	//console.log(base64);
	res.setHeader('content-type', 'image/jpeg');
	res.send(base64);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
