/**
 * Created by hebo on 13-12-4.
 */

var mongodb = require('./db');

function Post(name, title, post,type){
	this.name = name;
	this.title= title;
	this.post = post;
	this.type = type;
}

Post.prototype.save = function(callback){
	console.log('post-save')
	var date = new Date();
	//存储各种时间格式，方便以后扩展
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
		,time: time
		,title: this.title
		,post: this.post
		,type: this.type
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
Post.getByName = function(name, callback) {
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
					callback(null, docs);//成功！以数组形式返回查询的结果
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
					callback(null, docs);//成功！以数组形式返回查询的结果
				});
		});
	});
};

Post.remove = function(){

}

module.exports = Post;