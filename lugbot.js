var cheerio = require('cheerio'), 
    irc = require('irc'),
    request = require('request'),
    twitter = require('twitter-text');

var CHAN = '#utdlug',
    bot = new irc.Client('irc.oftc.net', 'lug-bot', {channels: [CHAN]});

bot.addListener('join', function(channel, nick) {
  switch (nick) {
    case 'cyanode':
    case 'desmond':
    case 'phy1729':
    case 'theplague':
    case 'xy86':
      bot.send('MODE', CHAN, '+o', nick);
      break;
  };
});

bot.addListener('message', function(from, to, msg) {
  var urls = twitter.extractUrls(msg);
  for (var i = 0; i < urls.length; i++) {
    request(urls[i], function(err, res, body) {
      bot.say(CHAN, cheerio.load(body)('title').text());
    });
  };
});
