/**
 * Created by hebo on 13-12-14.
 */
var mongodb = require('./db');

function Comment(day, title, comment) {
	this.day = day;
	this.title = title;
	this.comment = comment;
}
Comment.prototype.save = function(callback) {
	var day = this.day,
		title = this.title,
		comment = this.comment;
	//打开数据库
	console.log(comment)
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
			//通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
			collection.update({
				"time.day": day,
				"title": title
			}, {
				$push: {"comments": comment}
			} , function (err) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};










module.exports = Comment;
