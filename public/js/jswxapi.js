(function(t) {
	var url = 'http://wx.lifestyles.com.cn/index.html';
	
	t.getSignature = function() {
		$.post('/getjssignature', {url : url }, function(d){
			alert(d);	
		});			
	}	

})(test);
