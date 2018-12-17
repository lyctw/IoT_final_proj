const linebot = require('linebot');
const express = require('express');

// const CHANNEL_ID           = '1631087660',
//       CHANNEL_SECRET       = '3a4cae499590fbc23d2a7fbeaca1e2b5',
//       CHANNEL_ACCESS_TOKEN = 'uIwge3H5nhPcEyBXdCwGMnJs//9ZKW1iaTMv8VN4xl3hw8k13fN8WqORAd5YpqCmf+HC1ZtS/QAXtwm8RcYLz2FjsIsfctyI3xYD70SMO3K/SuVRVs+vW/NlkQX7gyBrMOr2DGmiw6s44OuUgANLEQdB04t89/1O/w1cDnyilFU=';

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

