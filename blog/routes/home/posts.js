var express = require('express');
var router = express.Router();
//mongodb模块，与数据库连接
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog";
const Objectid = require('objectid');
/* GET posts page. */
// router.get("/",(req,res,next)=>{
// 	res.render('posts');
// });
router.get('/',function(req,res,next){
	
	let id = req.query.id;
	//正确的
	// MongoClient.connect(url,(err,db)=>{
	// 	if(err) throw err;
	// 	let cats = db.collection('cats');
	// 	let posts = db.collection('posts');
	// 	posts.findOne({_id : Objectid(id)},(err,res2)=>{
	// 		// let posts = db.collection('posts');
	// 		if(err) throw err;
	// 		res.render('home/posts',{cats:cats,posts:res2});
	// 	});
	// });
	
//测试
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.find().toArray((err,res1)=>{
			if(err) throw err;
			//取文章
			let posts = db.collection('posts');
			posts.findOne((err,res2)=>{
				if(err) throw err;
				console.log(res1);
				console.log(res2);
				res.render('home/posts',{cats:res1,posts:res2});
			});
		});
	});
});
module.exports = router;