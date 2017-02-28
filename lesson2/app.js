var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();
app.get('/',function (req, res, next) {
    //对segmentfault爬虫，获取问题及用户和最近回答时间
    superagent.get('https://segmentfault.com/').end(function (err, sres) {
        if (err){
            return next(err);
        }
        var items = [];
        var $ = cheerio.load(sres.text);
        $('.summary').each(function (idx, element) {
            var $question= $(element).find($('.title a'));
            var $user = $(element).find($('.author a')).first();
            var $time = $(element).find($('.author a')).last();
            items.push({
                question:$question.text(),
                user:$user.text(),
                time:$time.text()
            });
        });
        res.send(items);
    });
});

app.listen(3000,function () {
    console.log('app is listening at port 3000');
})