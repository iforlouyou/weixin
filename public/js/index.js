$(document).ready(function(){
	/*-- 获取location.href参数---*/
	/**
	var reg = new RegExp("(^|&)code=([^&]*)(&|$)");
	var url = window.location.search.substr(1).match(reg);
	var code;
	if(url.length>0){
		code = unescape( url[2] );
	}else {
		return;
	}
	**/
	/**
		开发平台的微信登录
	var obj = new WxLogin({
		id : 'login_wx',
		appid: 'wx0941c415dcfb6497',
		scope: 'snsapi_login',
		redirect_uri: 'http%3a%2f%2fwx.lifestyles.com.cn%2ftest.html',
		state: '123',
		style: 'white'
	});
	**/
	//调用jssdk
	$.post('/getjssignature',{url: window.location.href }, function(dt) {
		if(dt.status != 0){
			alert(JSON.stringify(dt.msg));
			return;
		}
		wx.config(dt.data);
		wx.ready(function() {
			wx.checkJsApi({
				jsApiList: ['chooseImage', 'openLocation', 'getLocation','onMenuShareTimeline'],
				success: function(res){
					/*选择图片，声音类同--上传图片api上传微信服务器，保存为3天*/				
//					wx.chooseImage({
//						count: 1,
//						sizeType: ['original','compressed'],
//						sourceType: ['album','camera'],
//						complete: function(res) {
//							var localIds = res.localIds;
//							$('.content img').attr('src', localIds[0]);	//本地显示图片
//							/*图片上传到后台 从form表单提交，multipart/form-data*/
//							/*
//								............
//							*/
//						},
//
//					});
					/*定位和位置获取*/
					//wx.getLocation({
					//	type: 'wgs84',
					//	success: function(res) {
					//		var option = {
					//			latitude: res.latitude,
					//			longitude: res.longitude,
					//			name : '银丰大厦', //位置名
					//			address: '北京海淀区苏州街银丰大厦2号', //地址详细说明
					//			scale: 1, //地图缩放级别，范围1-28 整形，默认最大
					//			infoUrl: '',
					//		}
					//		wx.openLocation(option);
					//	}
					//});
					/*分享功能--朋友圈  只是获取的按钮点击状态和自定义分享内容接口 不能调起分享界面*/
					//wx.onMenuShareTimeline({
					//	title : '微信测试',
					//	link : 'http://wx.lifestyles.com.cn/test.html',
					//	imgUrl : '../images/jack.png',
					//	success : function() {
					//		//用户确认分享后执行的回调函数	
					//	},
					//	cancel : function() {
					//		alert('取消分享到朋友圈');
					//		//用户取消分享后执行的回调函数
					//	}
					//});
				},
				complete : function(res) {
					//alert(JSON.stringify(res));
				}
			});
		});
		wx.error(function(res) {
			alert(JSON.stringify(res));
			//$('#text').text(JSON.stringify(res));
		});
	});
	
});
