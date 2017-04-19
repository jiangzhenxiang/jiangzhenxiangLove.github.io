var express = require('express');
var router = express.Router();

const Objectid = require('objectid');
//mongodb模块，与数据库连接
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog";
//分类添加---获取表单提交的信息
router.post('/insert',function(req,res,next){
	console.log(req.body);
	let title = req.body.title;
	let order = req.body.order;
	//标题不能为空
	if (title.trim()==''||order.trim()=='') {
		res.render('admin/message',{msg:'标题不能为空'});
		return;
	}

	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');//获取集合
		cats.insert({title:title,order:order},(err,result)=>{
			if(err){
				//若失败，在主页显示 添加分类失败
				res.render('admin/message',{msg:'添加分类失败'});
			}else{
				//若成功，在主页显示 添加分类成功
				res.render('admin/message',{msg:'添加分类成功'});
				
			}
		})
	})
})

//后台cats分类管理的一级路由
router.get('/',function(req,res,next){
	//获取数据
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.find().toArray((err,result)=>{
			// console.log(result);
			res.render('admin/category_list',{cats:result});//分类列表
		})
	})
	// res.send('后台的分类显示');
	// res.render('admin/category_list')
})
router.get('/add',function(req,res,next){
	// res.send('后台的分类添加');
	res.render('admin/category_add')
})
//分页编辑
router.get('/edit',function(req,res,next){
	// 获取当前分类的信息
	let id = req.query.id;
	console.log(id);
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		//按条件来查询
		cats.findOne({_id:Objectid(id)},(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.render('admin/category_edit',{cat:result});
		})
	})
	// res.send('后台的分类编辑');
	// res.render('admin/category_edit')
})
//分页编辑--获取表单提交信息 从form的action
router.post("/update",function(req,res,next){
	let title = req.body.title;
	let order = req.body.order;
	let id = req.body.id;
	console.log(id);
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.update({_id:Objectid(id)},{$set:{title,order:order}},(err,db)=>{
			if(err) {
				res.render('admin/message',{msg:"更新分类失败"});
			}else{
				res.render('admin/message',{msg:"更新分类成功"});
			}
		})
	})
})
//删除分类
router.get('/delete',function(req,res,next){
	let id = req.query.id;
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let cats = db.collection('cats');
		cats.remove({_id:Objectid(id)},(err,result)=>{
			if(err){
				res.render('admin/message',{msg:"删除分类失败"})
			}else{
				res.render('admin/message',{msg:"删除分类成功"})
			}
		})
	})
})

router.get('/article_add',function(req,res,next){
	res.render('admin/article_add');
	// res.render('admin/category_')
})
router.get('/article_list',function(req,res,next){
	res.render('admin/article_list');
	// res.render('admin/category_')
})
router.get('/tag_list',function(req,res,next){
	res.send('标签列表');
	// res.render('admin/category_')
})
router.get('/tag_add',function(req,res,next){
	res.send('标签添加');
	// res.render('admin/category_')
})

module.exports = router;
