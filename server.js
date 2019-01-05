// Line Development https://developers.line.biz/console/channel/1631832658/basic/
// https://radiant-lake-70397.herokuapp.com/home/status
// https://radiant-lake-70397.herokuapp.com/dht22

const linebot = require('linebot');
const express = require('express');
const weather = require('./weather');
const axios   = require('axios');

// enviroment variables (for ngrok testing)
// require('./config');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

// db url
const DBUrl = 'https://radiant-lake-70397.herokuapp.com';

const app = express();

const linebotParser = bot.parser();

// root 
app.get('/', async (req,res) => {
    try {
        let data = await weather.getPM25('崙背');
        res.send(data);
    } catch (err) {
        res.send(err);
    }
});

// webhook
app.post('/linewebhook', linebotParser);



//postback 
bot.on('postback', async function (event) {
    //console.log(event.postback.data);
    if(event.postback.data === 'music on') {          ///////////////////////////////////////
        try {
            await axios.post(`${DBUrl}/home/volumio`, {playing: true});
            await event.reply('音樂已播放'); 
        } catch (err) {
            await event.reply('[ERROR] 音樂未播放'); 
        }
    } else if (event.postback.data === 'music off') {
        try {
            await axios.post(`${DBUrl}/home/volumio`, {playing: false});
            await event.reply('音樂已暫停');
        } catch (err) {
            await event.reply('[ERROR] 音樂未暫停'); 
        }
    } else if (event.postback.data === 'fan on') {    ///////////////////////////////////////
        try {
            await axios.post(`${DBUrl}/home/fan`, {fan: true});
            await event.reply('風扇已開啟');
        } catch (err) {
            await event.reply('[ERROR] 風扇未開啟'); 
        }
    } else if (event.postback.data === 'fan off') {
        try {
            await axios.post(`${DBUrl}/home/fan`, {fan: false});
            await event.reply('風扇已關閉');
        } catch (err) {
            await event.reply('[ERROR] 風扇未關閉'); 
        }
    } else if (event.postback.data === 'air con on') { ///////////////////////////////////////
        try {
            await axios.post(`${DBUrl}/home/airCondition/status`, {status: true});
            await event.reply('冷氣已開啟');
        } catch (err) {
            await event.reply('[ERROR] 冷氣未開啟'); 
        }
    } else if (event.postback.data === 'air con off') {
        try {
            await axios.post(`${DBUrl}/home/airCondition/status`, {status: false});
            await event.reply('冷氣已關閉');
        } catch (err) {
            await event.reply('[ERROR] 冷氣未關閉'); 
        }
    } else if (event.postback.data === 'light on') {  ///////////////////////////////////////
        try {
            await axios.post(`${DBUrl}/home/light`, {light: true});
            await event.reply('電燈已開啟');
        } catch (err) {
            await event.reply('[ERROR] 電燈未開啟'); 
        }
    } else if (event.postback.data === 'light off') {
        try {
            await axios.post(`${DBUrl}/home/light`, {light: false});
            await event.reply('電燈已關閉');
        } catch (err) {
            await event.reply('[ERROR] 電燈未關閉'); 
        }
    } else {
        await event.reply('指令錯誤');
    } 
});

/*
User:
Light > 開關燈按鈕
Air   > 電扇/冷氣 開關按鈕
音量30
音樂 > 播放停止
Room > 溫溼度 > url

//不實作
冷氣調節功能> 取得溫溼度感測器的資料 > 操作冷氣(用紅外線)
*/

// message event handler
bot.on('message', async function (event) {
    // console.log(event);
	switch (event.message.type) {
        // 文字類訊息
        case 'text':
        
            if (event.message.text === 'Hi') {
                await event.reply({
                    type: 'template',
                    altText: 'this is a carousel template',
                    template: {
                      type: 'carousel',
                      columns: [{
                        type: 'buttons',
                        thumbnailImageUrl: 'https://i.imgur.com/0du0nnZ.png',
                        title: '電燈',
                        text: 'description',
                        actions: [{
                          type: 'postback',
                          label: '打開',
                          data: 'light on'
                        }, {
                          type: 'postback',
                          label: '關閉',
                          data: 'light off'
                        }, {
                          type: 'uri',
                          label: 'View detail',
                          uri: 'http://example.com/page/111'
                        }]
                      }, {
                        thumbnailImageUrl: 'https://i.imgur.com/Jxp3cQs.png',
                        title: '電扇',
                        text: 'description',
                        actions: [{
                            type: 'postback',
                            label: '打開',
                            data: 'fan on'
                          }, {
                            type: 'postback',
                            label: '關閉',
                            data: 'fan off'
                          }, {
                            type: 'uri',
                            label: 'View detail',
                            uri: 'http://example.com/page/111'
                        }]
                      }, {
                        thumbnailImageUrl: 'https://i.imgur.com/bDkTjLZ.jpg',
                        title: '冷氣',
                        text: 'description',
                        actions: [{
                            type: 'postback',
                            label: '打開',
                            data: 'air con on'
                          }, {
                            type: 'postback',
                            label: '關閉',
                            data: 'air con off'
                          }, {
                            type: 'uri',
                            label: 'View detail',
                            uri: 'http://example.com/page/111'
                        }]
                      }]
                    }
                  });
            } else if (event.message.text.substring(0, 2) === '音樂') {
                await event.reply({
                  type: 'template',
                  altText: 'this is a buttons template',
                  template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://i.imgur.com/usCFXw9.png',
                    title: 'Player',
                    text: 'Volumio',
                    actions: [{
                      type: 'postback',
                      label: '播放',
                      data: 'music on'
                    }, {
                      type: 'postback',
                      label: '暫停',
                      data: 'music off'
                    }, {
                      type: 'uri',
                      label: 'Dashboard',
                      uri: 'http://192.168.1.105/'
                    }]
                  }
                });
                
            } else if (event.message.text.substring(0, 2) === '音量') { // 音量 30
                let vol = event.message.text.substring(2, event.message.text.length);
                if(isNaN(parseInt(vol))) {
                    await event.reply('[ERROR] 輸入音量錯誤，請重新輸入\nex.音量25');
                } else {
                    try {
                        await axios.post(`${DBUrl}/home/volumio/volumn`, {volumn: parseInt(vol)});
                        await event.reply(`音量已調整到${parseInt(vol)}`)
                    } catch(err) {
                        await event.reply(`[ERROR] 音量無法調整`)
                    }
                }
            } else if (event.message.text === 'Room') {
                try {
                    let res = await axios.get(`${DBUrl}/dht22`);
                    if(res.data.record.length === 0) {
                        await event.reply('無溫溼度歷史資訊');
                    } else {
                        console.log(res.data.record[0])
                        let latest = res.data.record[0];
                        await event.reply({
                            type: 'template',
                            altText: 'this is a buttons template',
                            template: {
                            type: 'buttons',
                            thumbnailImageUrl: 'https://i.imgur.com/f03kaG2.jpg',
                            title: '目前溫溼度',
                            text: `溫度: ${latest.temperature}℃\n濕度: ${latest.humidity*100}%`,
                            actions: [{
                                type: 'uri',
                                label: 'History',
                                uri: 'https://www.google.com'
                            }]
                            }
                        });
                    }
                    
                } catch (err) {
                    await event.reply('[ERROR] 無法取得溫溼度');
                }
            } else if (event.message.text === '!status') {
                await event.reply('https://radiant-lake-70397.herokuapp.com/home/status \nhttps://radiant-lake-70397.herokuapp.com/dht22 ');
            } else {
                try {
                    let data = await event.reply(event.message.text);
                    console.log('Success', data);
                } catch (err) {
                    console.log('Error', err);
                }
            }

            break;
        // 貼圖類訊息
        case 'sticker':
            event.reply({
                type: 'sticker',
                packageId: '1',
                stickerId: '1'
            });
            break;
        //
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