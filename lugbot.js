var cheerio = require('cheerio'); 
var irc = require('irc');
var Pinboard = require('node-pinboard');
var request = require('request');
var twitter = require('twitter-text');

var CHAN = '#utdlug';
var bot = new irc.Client('irc.oftc.net', 'utdlug', {channels: [CHAN]});
var pinboard = new Pinboard(process.argv[2]);

bot.addListener('message', function (from, to, msg) {
  twitter.extractUrls(msg).map(function (url) {
    try {
      if (url.substring(0, 4) != 'http') {
        url = 'http://' + url;
      };
    
      request(url, function (err, res, body) {
        pinboard.add({
          url: url, 
          description: cheerio.load(body)('title').text() || url,
          tags: ['by:' + from].concat(twitter.extractHashtags(msg)).join(','),
          replace: 'no',
        }, function (res) {
          console.log(res)
        })
      });
    } catch(e) {
      console.log(e);
    };
  });
});
