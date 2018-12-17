const linebot = require('linebot');
const express = require('express');

// const CHANNEL_ID           = '1631832658',
//       CHANNEL_SECRET       = 'acc649e977849b0c56668cf65fb3b78f',
//       CHANNEL_ACCESS_TOKEN = 'FISyLnxb8ogt53pxKzItlGkw1UMkSfY6FCeExz9CQYKT8nedVVN+8AmqDDq/B0yzHRsTfwyjez9Xf6nzcSNpkucQ6BRwDCB5BXaDS/ZLr014tc9eFMC4x2WVqv2H8Tlj1gpV2K51BVw9Q9yct03smwdB04t89/1O/w1cDnyilFU=';


const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();
const linebotParser = bot.parser(); 

app.get('/', (req, res) => {
    res.send('YOOOOOOOOOO');
})

app.post('/webhook', linebotParser)

bot.on('message', function (event) {
    // event.message.text是使用者傳給bot的訊息
    // 準備要回傳的內容
    var replyMsg = `Hello你剛才說的是:${event.message.text}`;
    // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
    event.reply(replyMsg).then(function (data) {
        console.log(event.replyToken, data);
    }).catch(function (error) {
        console.log(error);
    });
});

let PORT = process.env.PORT || 80;
app.listen(process.env.PORT, () => {
    console.log(`server is up on ${PORT}`);
})

