var cheerio = require('cheerio'); 
var irc = require('irc');
var Pinboard = require('node-pinboard');
var request = require('request');
var twitter = require('twitter-text');

var CHAN = '#utdlug' + (process.argv[3] ? 'testing' : '');
var bot = new irc.Client('irc.oftc.net', 'utdlug', {channels: [CHAN]});
var pinboard = new Pinboard(process.argv[2]);

bot.addListener('join', function(chan, nick) {
    if (['argonaut',
         'cyanode',
         'drijen',
         'Freek',
         'Imster',
         'jtm',
         'justanull',
         'kennyloglins',
         'kennyloggins',
         'm_wynn',
         'MajObviousman',
         'maldridge',
         'maldridge-weechat',
         'ninjabox',
         'phy1729',
         'programisto',
         'scrollback1',
         'SuperNoeMan',
         'tig3rp4w',
         'travnewmatic',
         'utdlug'
	].indexOf(nick) == -1) {
        bot.say(CHAN, 'Hey, ' + nick + '. Good to see you here. If you have a question or want to talk about something, stick around. You might not get an immediate response, but someone will get back with you; people check this channel off and on day and night. Keep on luggin.');
    } 
});

bot.addListener('message', function(from, to, msg) {
  twitter.extractUrls(msg).map(function(url) {
    try {
      if (url.substring(0, 4) != 'http') {
        url = 'http://' + url;
      };
    
      request(url, function(err, res, body) {
        pinboard.add({
          url: url, 
          description: cheerio.load(body || '')('title').text() || url,
          tags: ['by:' + from].concat(twitter.extractHashtags(msg)).join(','),
          replace: 'no',
        }, function(res) {
          console.log(res);
        })
      });
    } catch(e) {
      console.log(e);
    };
  });
});
