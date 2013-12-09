/**
 * Created by hebo on 13-12-8.
 */

var fs = require('fs')
	,path = require('path')
	,qiniu = require('node-qiniu')
	,setting = require('../config');

/**
 * 7牛配置
 */
qiniu.config({
	access_key: setting.qiniuAK,
	secret_key: setting.qiniuSK
});

var imagesBucket = qiniu.bucket('iyueyao');

var index = function(req,res){
	for (var i in req.files) {
		if (req.files[i].size == 0){
				fs.unlinkSync(req.files[i].path);
		} else {
			 var target_path = './uploads/' + req.files[i].name
				 ,relpath = path.resolve(__dirname,'.'+target_path)
				 ,filename = String(Math.random()*10).replace(/\./,'n')
				 ,fileUrl = setting.qiniu+'uploads/'+filename;

				fs.rename(req.files[i].path, target_path,function(err){
					  if(err) throw err;
						imagesBucket.putFile('uploads/'+filename, relpath, function(err, reply) {
							fs.unlink(target_path, function(err){
								if(err) throw err;
							})
							if (err) {
								return res.send({status:'false',msg:err});
							}

							req.flash('success', '文件上传成功!');
							res.send({status:'true',msg:'上传成功！',img:fileUrl});
						});
				});
		}
	}
};



exports.index = index;