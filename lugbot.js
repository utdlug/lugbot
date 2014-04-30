var irc = require('irc');

var bot = new irc.Client('irc.oftc.net', 'lug-bot', {channels: ['#utdlug']});
bot.addListener('join', function(channel, who) {
  if (who == 'xy86') {
    bot.send('MODE', '#utdlug +o ' + who);
    bot.say('#utdlug', 'such lug');
  };
});
