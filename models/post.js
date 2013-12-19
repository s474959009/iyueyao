/**
 * Created by hebo on 13-12-4.
 */

var mongodb = require('./db')
	,markdown = require('markdown').markdown
	,random36 = require('../lib/util').random36;

function Post(name, title, post, img ,type,homeRecom){
	this.name = name;
	this.title= title;
	this.post = post;
	this.img = img;
	this.type = type;
	this.homeRecom = homeRecom;
}

Post.prototype.save = function(callback){
	var date = new Date();
	//存储各种时间格式，方便以后扩展
	var uuid = random36(16)+(new Date().getMonth()+1)+new Date().getDate();
	var time = {
		date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	//要存入数据库的文档
	var post = {
		name: this.name
		,uuid:uuid
		,time: time
		,title: this.title||time.day
		,post: this.post
		,type: this.type
		,img: this.img
		,homeRecom: this.homeRecom
		,comments: []
	};
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//将文档插入 posts 集合
			collection.insert(post, {
				safe: true
			}, function (err) {
				mongodb.close();
				if (err) {
					return callback(err);//失败！返回 err
				}
				callback(null);//返回 err 为 null
			});
		});
	});
}
//读取文章及其相关信息
Post.getAll = function(name, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			//根据 query 对象查询文章
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
					mongodb.close();
					if (err) {
						return callback(err);//失败！返回 err
					}
                    docs.forEach(function (doc) {
                        doc.post = markdown.toHTML(doc.post);
                    });
                    callback(null, docs);//成功！以数组形式返回查询的结果
				});
		});
	});
};
//一次获取10
Post.getFive = function(type, page, callback){
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(type){
				query.type = type;
			}
			//使用 count 返回特定查询的文档数 total
			collection.count(query, function (err, total) {
				//根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
				collection.find(query, {
					skip: (page - 1)*5,
					limit: 5
				}).sort({
						time: -1
					}).toArray(function (err, docs) {
						mongodb.close();
						if (err) {
							return callback(err);
						}
						//解析 markdown 为 html
						docs.forEach(function (doc) {
							doc.post = markdown.toHTML(doc.post);
						});
						callback(null, docs, total);
					});
			});
		});
	});
};
//读取文章类型
Post.getByType = function(type, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if (type) {
				query.type = type;
			}
			//根据 query 对象查询文章
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, docs) {
					mongodb.close();
					if (err) {
						return callback(err);//失败！返回 err
					}
					docs.forEach(function (doc) {
						doc.post = markdown.toHTML(doc.post);
					});
					callback(null, docs);//成功！以数组形式返回查询的结果
				});
		});
	});
};
//获得存档
Post.getArchive = function(callback){
    mongodb.open(function(err,db){
        if(err) {
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            collection.find({}, {
                "uuid": 1,
                "time": 1,
                "title": 1,
                "type": 1
            }).sort({
                time:-1
            }).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, docs);
            })
        })
    })
} ;

Post.getOne = function(uuid, type, callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//根据用户名、发表日期及文章名进行查询
			collection.findOne({
				"uuid": uuid ,
				"type": type
			}, function (err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				//解析 markdown 为 html
				if (doc) {
					doc.post = markdown.toHTML(doc.post);
					/*doc.comments.forEach(function (comment) {
						comment.content = markdown.toHTML(comment.content);
					});*/
				}
				callback(null, doc);//返回查询的一篇文章
			});
		});
	});
};

Post.edit = function(uuid, type , callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//根据用户名、发表日期及文章名进行查询
			collection.findOne({
				"type": type,
				"uuid": uuid
			}, function (err, doc) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, doc);//返回查询的一篇文章（markdown 格式）
			});
		});
	});
};

Post.update = function(uuid, post, type, homeRecom, img, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//更新文章内容
			collection.update({
				"type": type,
				"uuid": uuid
			}, {
				$set: {post: post,homeRecom:homeRecom,img:img}
			}, function (err) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//删除一篇文章
Post.remove = function(uuid, type,callback) {
	//打开数据库
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//读取 posts 集合
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//根据用户名、日期和标题查找并删除一篇文章
			collection.remove({
				"uuid": uuid ,
				"type": type
			}, {
				w: 1
			}, function (err) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

module.exports = Post;