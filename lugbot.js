var cheerio = require('cheerio'), 
    irc = require('irc'),
    request = require('request'),
    twitter = require('twitter-text');

var CHAN = '#utdlug',
    bot = new irc.Client('irc.oftc.net', 'lug-bot', {channels: [CHAN]});

bot.addListener('join', function (channel, nick) {
  if (['cyanode', 'desmond', 'phy1729', 'theplague', 'xy86'].indexOf(nick) != -1) {
      bot.send('MODE', CHAN, '+o', nick);
  };
});

bot.addListener('message', function (from, to, msg) {
  twitter.extractUrls(msg).map(function (url) {
    if (url.substring(0, 4) != 'http') {
      url = 'http://' + url;
    };
    
    try {
      request(url, function (err, res, body) {
        bot.say(CHAN, cheerio.load(body)('title').text());
      });
    } catch(e) {
      console.log(e);
    };
  });
});
