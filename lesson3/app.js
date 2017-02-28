var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');
var url = require('url');
var app = express();
var eventproxy = require('eventproxy');
app.get('/',function (req, res, next) {
    superagent.get('https://segmentfault.com/').end(function (err, sres) {
        if (err) {
            return next(err)
        }
        var $ = cheerio.load(sres.text);
        var userUrls = [];
        $('.author').each(function (index, element) {
           var $userHref=$(element).find($('a')).first();
           var segUrl = 'https://segmentfault.com';
           var userUrl = url.resolve(segUrl,$userHref.attr('href'));
           userUrls.push(userUrl);
        })
        console.log(userUrls);
        var ep = new eventproxy();
        var resArr= [];
        ep.after('personal_html',userUrls.length,function (results) {
            results = results.map(function (result) {
                var userUrl = result[0];
                var userHtml = result[1];
                var $ = cheerio.load(userHtml);
                var tempText =$('.profile__heading--name').text().trim()
                var text= tempText.substring(0,tempText.length-6).trim();
                var index1 = $('.profile__school').text().indexOf('\n');
                var school = $('.profile__school').text().substr(0,index1);
                var index2 = $('.profile__company').text().indexOf('\n');
                var company = $('.profile__company').text().substr(0,index2)
                return({
                    userName:text,
                    reputation:$('.profile__rank-btn .h4').text(),
                    school:school,
                    company:company,
                    userUrl:userUrl
                })
            })
            console.log(results)
        });
        userUrls.forEach(function (userUrl) {
            superagent.get(userUrl).end(function (err, res) {
                ep.emit('personal_html',[userUrl,res.text])
                console.log('==============')
            })
        })
        res.send(resArr);
    })
})
app.listen(3000,function () {
    console.log('app is listening at port 3000')
})