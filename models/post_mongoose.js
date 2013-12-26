/**
 * Created by hebo on 13-12-25.
 */
/**
 * Created by hebo on 13-12-4.
 */

var mongoose = require('./db_mongoose')
	,ObjectID = require('mongodb').ObjectID
	,markdown = require('markdown').markdown
	,random36 = require('../lib/util').random36;

var postSchema = new mongoose.Schema({
	name:String,
	title:String,
	time:Object,
	desc:String,
	post:String,
	img:String,
	homeRecom:Boolean,
	tags:Array ,
	comments:Array,
	uuid:String,
	type:String,
	pv:Number
},{
	collection: 'posts'
});
var postModel =mongoose.model('Posts', postSchema);

function Post(post){
	this.name = post.name;
	this.title= post.title;
	this.desc = post.desc;
	this.post = post.post;
	this.img = post.img;
	this.type = post.type;
	this.homeRecom = post.homeRecom;
	this.tags = post.tags;
}

Post.prototype.save = function(callback){
	var date = new Date();
	//uuid
	var uuid = random36(16)+(new Date().getMonth()+1)+new Date().getDate();
	//存储各种时间格式，方便以后扩展
	var time = {
		date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	};
	//要存入数据库的文档
	var post = {
		name: this.name
		,uuid:uuid
		,time: time
		,title: this.title||time.day
		,post: this.post
		,desc:this.desc
		,type: this.type
		,img: this.img
		,homeRecom: this.homeRecom
		,tags : this.tags
		,comments: []
		,pv :0
	};

	var newPost = new postModel(post);
	newPost.save(function (err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	})
};
//读取文章及其相关信息
Post.getAll = function(callback) {
	var query = postModel.find({}) ;
	query.sort('-time');
	query.exec(function(err, docs){
		if (err) {
			return callback(err);
		}
	    docs.forEach(function (doc) {
			doc.post = markdown.toHTML(doc.post);
		});
		callback(null, docs);
	});
};

Post.getFive = function(type, page, callback){
	postModel.count({},function(err,total){
		var query = postModel.find({},null,{skip:(page - 1)*5,limit: 5});
		query.sort('-time');
		query.exec(function(err,docs){
			if(err) throw(err);
			docs.forEach(function (doc) {
				doc.post = markdown.toHTML(doc.post);
			});
			callback(null, docs, total);
		})
	})
};

Post.getByType = function(type, callback) {
	var query = postModel.find({type:type});
	query.exec(function(err,docs){
		docs.forEach(function (doc) {
			doc.post = markdown.toHTML(doc.post);
		});
		callback(null, docs)
	})
};
Post.getTopic = function(callback){
	var query = postModel.find({type:'topic'});
    query.sort('-time');
	query.exec(function(err,docs){
		docs.forEach(function (doc) {
			doc.post = markdown.toHTML(doc.post);
		});
		callback(null, docs[0])
	})
};

Post.getArchive = function(callback){
	var query = postModel.find({}) ;
	query.sort('-time');
	query.exec(function(err, docs){
		if (err) {
			return callback(err);
		}
		docs.forEach(function (doc) {
			doc.post = markdown.toHTML(doc.post);
		});
		callback(null, docs);
	});
} ;

Post.getOne = function(uuid,type,callback) {

	var query = postModel.findOne({"uuid":uuid,"type":type}) ;
	query.exec(function(err,doc){
		if (err) {
			return callback(err);
		}
		doc.post = markdown.toHTML(doc.post);
		callback(null, doc);
	})
};

Post.getTag = function(tag,callback){
	var query = postModel.find({},'tags');
    var baseTags = [];
	query.exec(function(err,docs){
		if (err) {
			return callback(err);
		}
        docs.forEach(function(doc){
            if(doc.tags.length){
                baseTags=baseTags.concat(doc.tags);
            }
        })
		callback(null, baseTags);
	});
};

Post.getByTag=function(tag,callback){
    var query = postModel.find({"tags": tag});
    query.sort('-time');
    query.exec(function(err,docs){
        if (err) {
            return callback(err);
        }
        callback(null, docs);
    })

}

Post.edit = function(uuid, type , callback) {
	var query = postModel.findOne({"uuid":uuid,"type":type}) ;
	query.exec(function(err,doc){
		if (err) {
			return callback(err);
		}
		callback(null, doc);
	})
};


Post.update = function(uuid, post, type, homeRecom, img, callback) {
	var query = postModel.findOneAndUpdate({"uuid":uuid,"type":type},{
		$set: {post: post,homeRecom:homeRecom,img:img}
	});
	query.exec(function(err){
        if (err) {
            return callback(err);
        }
        callback(null);
	})
};


Post.remove = function(uuid, type,callback) {
	var query = postModel.findOneAndRemove({"uuid":uuid,"type":type});
	query.exec(function(err){
		if (err) {
			return callback(err);
		}
		callback(null);
	})
};

Post.getById = function(_id,callback){
	var query = postModel.findById(_id);
	query.exec(function(err,doc){
		if (err) {
			return callback(err);
		}
		doc.post = markdown.toHTML(doc.post);
		callback(null,doc);
	});
}

//模糊查询
Post.search = function(keyword, callback) {
    var pattern = new RegExp("^.*" + keyword + ".*$", "i");
    var query = postModel.find({"title": pattern});
    query.sort('-time');
    query.exec(function(err,docs){
        if (err) {
            return callback(err);
        }
        callback(null, docs);
    })
};

module.exports = Post;
