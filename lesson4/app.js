"use strict"
var cheerio = require('cheerio');
var async = require('async');
var superagent = require('superagent');
var url = require('url');
//获取url,控制并发数量为10
var userUrls = [];
var resultArr=[]
var getUrl = function () {
    return new  Promise(function (resolve, reject) {
        superagent.get('https://segmentfault.com/')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                $('.author').each(function (index, element) {
                    var $userHref=$(element).find($('a')).first();
                    var userUrl = url.resolve('https://segmentfault.com/',$userHref.attr('href'));
                    userUrls.push(userUrl);
                    if(index==$('.author').length-1){
                        resolve();
                    }
                })
            })
    })

}
var getInfo = function (callback) {
  async.mapLimit(userUrls,10,function (userUrl, callback) {
        superagent.get(userUrl).end(function (err, res) {
            var $ = cheerio.load(res.text);
            var tempText =$('.profile__heading--name').text().trim()
            var text= tempText.substring(0,tempText.length-6).trim();
            var index1 = $('.profile__school').text().indexOf('\n');
            var school = $('.profile__school').text().substr(0,index1);
            var index2 = $('.profile__company').text().indexOf('\n');
            var company = $('.profile__company').text().substr(0,index2)
            var result ={};
            result.username=text;
            result.reputation=$('.profile__rank-btn .h4').text();
            result.school=school;
            result.company=company
            callback(null,result);
        })
    },function (err, results) {
            callback(err,results);
    })

}

getUrl().then(function(){
   getInfo(function (err,results) {
        console.log(results)
    })
})

