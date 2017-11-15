var convert = require('xml-js');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var fio = require('./lib/wx/fileio');

var xml = fio.readConfig();
var xjson = JSON.parse( convert.xml2json(xml, {
	compact: true,
	spaces: 4
}) );

	process.env.appid= xjson.xml.appid._text;
	process.env.appsecret= xjson.xml.appsecret._text;
	process.env.access_token= xjson.xml.access_token._text;
	process.env.expires_in= xjson.xml.expires_in._text;
	process.env.token =  xjson.xml.token._text;
	process.env.wxpubacc = xjson.xml.wxpubacc._text;

	/*创建工作进程*/
	console.log('master '+ process.pid +' is running');
	if(numCPUs == 1) {
		/*单核-主进程监听2000，子进程监听80*/
		require('./bin/www');
		cluster.setupMaster({
				exec: 'index.js',
				args: ['--use','http', 80],
				silent: true
		});	
		cluster.fork();
	}else {
		for(var  i = 0; i< numCPUs; i++) {
			/*多核-1个cpu分配给80，其他分配给2000*/
			if(i == numCPUs-1) {
				cluster.setupMaster({
					exec: 'index.js',
					args: ['--use','http', 80],
					silent: true
				});		
			}else {
				cluster.setupMaster({
					exec: 'bin/www',
					args: ['--use', 'http', 2000],
					silent: true
				});
			}
			cluster.fork();
		}
	}
	
	cluster.on('exit', (worker, code, signal) => {
		console.log('worker '+ worker.process.pid +' exit --code '+code);
	});

	/*进程之间通讯,默认限制10个事件*/
		
	//process.send({cmd: 'notify', 'pid': process.pid, 'args': process.argv.splice(0)});  //子进程给住进程发送消息
	var messageHandler = function(msg) {
		if(msg.cmd && msg.cmd === 'notify') {
			console.log('worker pid:'+msg.pid+' args--'+msg.args)
		}
	}
	for(var id in cluster.workers) {
		cluster.workers[id].on('message', messageHandler);
	}
