var express =require('express');
var router = express.Router();
//get admin index page 后台主页
router.get('/',function(req,res,next){
	res.render('admin/index');
});
module.exports = router;