#图文模板

title	是	标题
thumb_media_id	是	图文消息的封面图片素材id（必须是永久mediaID）
author	否	作者
digest	否	图文消息的摘要，仅有单图文消息才有摘要，多图文此处为空。如果本字段为没有填写，则默认抓取正文前64个字。
show_cover_pic	是	是否显示封面，0为false，即不显示，1为true，即显示
content	是	

图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源"上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤。
content_source_url	是	图文消息的原文地址，即点击“阅读原文”后的URL
