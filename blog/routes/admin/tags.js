var express = require('express');
var router = express.Router();
var path = require('path');
 
router.get('/',function(req,res,next){
	res.send('标签列表页 待完善。。。');
});
router.get('/add',function(req,res,next){
	res.send('标签添加页 待完善。。。');
});
module.exports = router;