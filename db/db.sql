
DROP TABLE  IF EXISTS app_wx_user;
DROP TABLE  IF EXISTS  appuser;
DROP TABLe  IF EXISTS wxuser;
DROP TABLE  IF EXISTS chat;
DROP TABLE  IF EXISTS replymsg;


-- userinfo
-- --- type 0 普通用户 1 普通会员 2 黄金会员 3 钻石会员

create  table appuser( 
	id  serial  primary key,
	uid varchar(100) UNIQUE  not null,
	name  varchar(100) UNIQUE  not null,
	nickname varchar(100) default '',  
	pwd   varchar(100) not null,
	email varchar(100) not null default '',
	phone varchar(100) not null default '',
	address varchar(500) default '',
 	icon  varchar(200)  not null default '',
	active boolean  default true,
	type   integer  default 0,
	peroid integer  default (24*3600*30),
	isadmin boolean  default false,
	logintime timestamp without time zone default 'infinity',
	loginouttime timestamp without time zone default 'infinity',
	ctime  timestamp without time zone default 'infinity',
	dtime	timestamp without time zone default 'infinity'
);


-- wxuser

create table wxuser (
	id serial primary key,
	wid varchar(100)  UNIQUE not null,
	nickname varchar(100) not null default '',
	country  varchar(20),
	province varchar(20),
	city varchar(50),
	headimgurl varchar(200),
	subscribe_time  integer,
	remark varchar(100),
	groupid integer,
	tagid_list varchar(100) 
);

--app_wx_user

create table app_wx_user(
	id serial  primary key,
	uid  varchar(100) not null,
	wid    varchar(100)	not null,
	FOREIGN KEY (uid)  REFERENCES appuser(uid),
	FOREIGN KEY (wid) REFERENCES wxuser(wid)
);

--replymsg
create table replymsg(
	id serial primary key,		
	media_id  varchar(100) default null,
	content varchar(200) default null,
	template  json  default null,
	detail varchar(100)  default null, /*通过正则表达式匹配选择哪个回复模板*/
	ctime timestamp without time zone default 'infinity',
	dtime timestamp without time zone default 'infinity'
);

--chat
create table chat(
	id serial primary key,
	rid  integer not null,
	touser varchar(100)  not null,
	fromuser varchar(100) not null,
	msg varchar(500)  default null,
	ctime  timestamp without time zone default 'infinity',
	dtime  timestamp without time zone default 'infinity',
	FOREIGN KEY (rid) REFERENCES replymsg(id)
);


