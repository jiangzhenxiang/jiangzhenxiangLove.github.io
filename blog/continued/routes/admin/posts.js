var express = require('express');
var router = express.Router();
const Objectid = require('objectid');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog';

router.get('/',function(req,res,next){
	// 获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		const posts = db.collection('posts');
		posts.find().toArray((err,result)=>{
			if(err) throw err;
			res.render('admin/article_list',{posts:result});
		})
	})
});
//文章添加
router.get('/add',function(req,res,next){
	// 获取所有的分类数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		// console.log(cats);
		cats.find().toArray((err,result)=>{
			console.log(result);
			res.render('admin/article_add',{cats:result});
		});
	});
});
// 文章添加中的表单
router.post('/insert',function(req,res,next){
	//获取表单提交的数据
	// console.log(req.body);
	// let cat = req.body.cat;
	// let subject = req.body.subject;
	// let summary = req.body.summary;
	// let content = req.body.content;
	//实例化一个form对象
	let tmp = path.join(__dirname,"../../public/tmp");

	const form = new multiparty.Form({uploadDir:tmp});
	form.parse(req,(err,fields,files)=>{
		console.log(fields);
		console.log(files);
		//将图片从临时目录转移到指定目录
		let oldPath = files.cover[0].path;
		let newPath = path.join(__dirname,"../../public/uploads",files.cover[0].originalFilename);
		fs.rename(oldPath,newPath,(err)=>{
			if(err) throw err;
			//保存成功
			////博客对象
			let article = {
				cat:fields.cat[0],
				subject:fields.subject[0],
				summary:fields.summary[0],
				content:fields.content[0],
				time: new Date(),
				count:Math.ceil(Math.random()*100),
				cover:path.join('uploads',files.cover[0].originalFilename)
			}
			//入库
			MongoClient.connect(url,(err,db)=>{
				if(err) throw err;
				let posts = db.collection('posts');
				posts.insert(article,(err,result)=>{
					if(err) {
						res.render('admin/message',{msg:'添加博客失败'});
					}else{
						res.render('admin/message',{msg:'添加博客成功'});
					}
				})
			})
		});
	});
});
router.get('/edit',function(req,res,next){
	// 获取当前分类的信息
	let id = req.query.id;
	console.log("post的id"+id);
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		// let cats = db.collection('cats');
		let posts = db.collection('posts');
		//按条件来查询
		// console.log(posts.subject)

		posts.findOne({_id:Objectid(id)},(err,result)=>{
			if(err) throw err;
			// console.log(result);
			res.render('admin/article_edit',{post:result});
			// res.send('aaa')
		})
	})
	// res.render('admin/article_edit',{});
	
});
//文章编辑--获取表单提交信息 从form的action
router.post('/update',function(req,res,next){
	let category_id = req.body.category_id;//文章分类
	let subject = req.body.subject;//文章标题
	let cover = req.body.cover;//文章封面
	let summary = req.body.summary;//文章摘要
	let content = req.body.content;//文章内容
	let id = req.body.id;
	console.log(id);
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let posts = db.collection('posts');
		posts.update({_id:Objectid(id)},{$set:{subject:subject,cover:cover,summary:summary,content:content}},(err,db)=>{
			if(err) {
				res.render('admin/message',{msg:"更新分类失败"});
			}else{
				res.render('admin/message',{msg:"更新分类成功"});
			}
		})
	})
});
router.get('/delete',function(req,res,next){
	let id = req.query.id;
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let posts = db.collection('posts');
		posts.remove({_id:Objectid(id)},(err,result)=>{
			if(err){
				res.render('admin/message',{msg:"删除分类失败"})
			}else{
				res.render('admin/message',{msg:"删除分类成功"})
			}
		})
	})
});
module.exports = router;