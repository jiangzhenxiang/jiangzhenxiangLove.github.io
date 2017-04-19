var express =require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/blog'; //数据库blog

router.get('/login',function(req,res,next){
	//判断是否已经登录
	if (req.session.isLogin) {
		res.redirect('/admin');
	} else {
		res.render('admin/login');
	}
	// res.render('admin/login');
	// res.send('aaa');
});
router.post("/signin",(req,res)=>{
	//获取用户名和密码
	let username = req.body.username;
	let password = req.body.password;
	// console.log(username);
    // console.log(password);

	MongoClient.connect(url,(err,db)=>{
		
		if(err) throw err;
		let user = db.collection('user');//数据库blog下面的几个user；
		// console.log(db);
		console.log(user);
		user.findOne({username : username, password: password}, (err,result)=>{
			//判断result是否有值
			// console.log(result);
			// console.log(username);
			// console.log(password);
			if(err) throw err;
			if(result){
				// console.log(result);
				// console.log('正确')
				// 用户名密码正确
				// 设置session 然后跳转
				req.session.isLogin = 1;
				res.redirect('/admin');
			}else{
				console.log('错误')
				// console.log(result);
				res.redirect('/user/login');
			}
		})
	})
});
//注销操作
router.get('/logout',(req,res)=>{
	//就是销毁session
	req.session.destroy();
	//跳转
	res.redirect('/admin');
})
module.exports = router;