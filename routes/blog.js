/**
 * Created by hebo on 13-12-3.
 */
var index = function(req,res){
	res.render('blog',{
		title:'blog'
		,user: req.session.user
		,success: req.flash('success').toString()
		,error: req.flash('error').toString()
	});
} ;


exports.index = index;