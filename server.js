const linebot = require('linebot');
const express = require('express');

// const CHANNEL_ID           = '1631087660',
//       CHANNEL_SECRET       = '3a4cae499590fbc23d2a7fbeaca1e2b5',
//       CHANNEL_ACCESS_TOKEN = 'zH4jV1mw3XYGi1L04TqQbCXXrMWGp2jHENB+kW3BnAbEN8SSAbnD0lO2RcOXsteNf+HC1ZtS/QAXtwm8RcYLz2FjsIsfctyI3xYD70SMO3J00p9KS2EEJO+QzyVnBZKvCs2TzXA0WvLxiVDwlX7+nQdB04t89/1O/w1cDnyilFU=';

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
app.listen(PORT, () => {
    console.log(`server is up on ${PORT}`);
})

