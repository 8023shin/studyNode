//引入依赖
var express = require('express');
var utility = require('utility');
//创建app实例
var app = new express();
app.get('/',function (req, res) {
    //从req.query中取出我们的q参数
    //如果是post传来的body数据，则是在req.body里面
    var q = req.query.q;
    var md5Value = utility.md5(q);
    res.send(md5Value);
});
app.listen(3000,function (req, res) {
    console.log('app is running at port 3000');
});
