const linebot = require('linebot');
const express = require('express');

// const CHANNEL_ID           = '1631832658',
//       CHANNEL_SECRET       = 'acc649e977849b0c56668cf65fb3b78f',
//       CHANNEL_ACCESS_TOKEN = 'FISyLnxb8ogt53pxKzItlGkw1UMkSfY6FCeExz9CQYKT8nedVVN+8AmqDDq/B0yzHRsTfwyjez9Xf6nzcSNpkucQ6BRwDCB5BXaDS/ZLr014tc9eFMC4x2WVqv2H8Tlj1gpV2K51BVw9Q9yct03smwdB04t89/1O/w1cDnyilFU=';

const bot = linebot({
    channelId: CHANNEL_ID,
    channelSecret: CHANNEL_SECRET,
    channelAccessToken: CHANNEL_ACCESS_TOKEN
});

const app = express();
const linebotParser = bot.parser(); 

app.get('/', (req, res) => {
    res.send('YOOOOOOOOOO');
})

app.post('/webhook', linebotParser)

bot.on('message', (event) => {
    event.reply(event.message.text).then((data) => {
        console.log('Success', data);
    }).catch((error) => {
        console.log('Error', error);
    });
});

let PORT = process.env.PORT || 80;
app.listen(process.env.PORT, () => {
    console.log(`server is up on ${PORT}`);
})

