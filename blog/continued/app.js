var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
// 载入自定义模块 在第29行使用
var index = require('./routes/home/index');//引入index模块 然后在下面use
// var users = require('./routes/admin/users');
var posts = require('./routes/home/posts')//.js可以省略
var admin = require('./routes/admin/index.js')
var cats = require('./routes/admin/cats')//分类路由
var article = require('./routes/admin/posts.js');//文字路由
var tags = require('./routes/admin/tags');//标签路由
//用户登录信息
var user = require('./routes/admin/user');
// 实例化一个app对象
var app = express();

// view engine setup 
app.set('views', path.join(__dirname, 'views'));//设置模板目录
app.set('view engine', 'ejs');			//设置模板引擎ejs文件 还可以jade文件

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));
//会话机制
app.use(session({
	secret:'blog',
	resave:false,
	saveUninitialized:true,
	cookie:{}
}));
//判断是否登录
app.use("/admin",(req,res,next)=>{
	if(!req.session.isLogin){
		//没有登录 则跳转到登录页面
		res.redirect('/user/login');
		return;
	}
	next();
})
// 第一个参数是路径，第二个参数是中间件:index指第8行的index，第8行的index是定义好的一个路由处理模块--index.js，
app.use('/', index);
// app.use('/users', users);
//文章页面的路由
app.use("/posts",posts);
//后台首页路由
app.use('/admin',admin);
//后台cats分类管理的一级路由
app.use("/admin/cats",cats);
//后台文字管理的一级路由
app.use('/admin/posts',article);
//后台标签管理的一级路由
app.use('/admin/tags',tags);
//后台用户管理的一级路由
app.use('/user',user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
