var irc = require('irc');

var bot = new irc.Client('irc.oftc.net', 'lug-bot', {channels: ['#utdlug']});
bot.addListener('join', function(channel, who) {
  switch (who) {
    case 'cyanode':
    case 'desmond':
    case 'phy1729':
    case 'theplague':
    case 'xy86':
      bot.send('MODE', '#utdlug', '+o', who);
      break;
    default:
      bot.say('#utdlug', 'hi ' + who);
  };
});
