const LINEBot = require('line-messaging');

// const CHANNEL_ID           = '1631832658',
//       CHANNEL_SECRET       = 'acc649e977849b0c56668cf65fb3b78f',
//       CHANNEL_ACCESS_TOKEN = 'FISyLnxb8ogt53pxKzItlGkw1UMkSfY6FCeExz9CQYKT8nedVVN+8AmqDDq/B0yzHRsTfwyjez9Xf6nzcSNpkucQ6BRwDCB5BXaDS/ZLr014tc9eFMC4x2WVqv2H8Tlj1gpV2K51BVw9Q9yct03smwdB04t89/1O/w1cDnyilFU=';


var app = require('express')();
const server = require('http').Server(app)

var bot = LINEBot.Client({
  channelID: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
}, server);

app.use(bot.webhook('/webhook'));

bot.on(LINEBot.Events.MESSAGE, function(replyToken, message) {
    bot.replyTextMessage(replyToken, 'hello!').then(function(data) {
    // add your code when success.
    }).catch(function(error) {
    // add your code when error.
    });
});



bot.listen(process.env.PORT);
