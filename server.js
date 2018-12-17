const linebot = require('linebot');
const express = require('express');
const weather = require('./weather');

process.env.CHANNEL_ID = '1631832658';
process.env.CHANNEL_SECRET = 'acc649e977849b0c56668cf65fb3b78f';
process.env.CHANNEL_ACCESS_TOKEN = 'FISyLnxb8ogt53pxKzItlGkw1UMkSfY6FCeExz9CQYKT8nedVVN+8AmqDDq/B0yzHRsTfwyjez9Xf6nzcSNpkucQ6BRwDCB5BXaDS/ZLr014tc9eFMC4x2WVqv2H8Tlj1gpV2K51BVw9Q9yct03smwdB04t89/1O/w1cDnyilFU=';

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.get('/',function(req,res){
    
    // res.send('Hello World!');
    weather.getPM25('大安').then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
    // console.log(event);
	switch (event.message.type) {
        case 'text':
            event.reply(event.message.text).then(data => {
                console.log('Success', data);
            }).catch(err => {
                console.log('Error', err);
            })
            break;

        case 'sticker':
            event.reply({
                type: 'sticker',
                packageId: '1',
                stickerId: '1'
            });
            break;

        default:
            event.reply({
                type: 'sticker',
                packageId: '1',
                stickerId: '1'
            });
    }

    
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});