// 192.168.1.152
const io = require('socket.io-client');
const yc = require('./utils/req-promise');
const https = require('https');
const mqtt = require('mqtt');

const socket = io.connect('http://192.168.1.105:3000');
const client = mqtt.connect('mqtt://192.168.1.152');

const DBUrl = 'https://radiant-lake-70397.herokuapp.com/home/status';

const updateFreq = 500; // ms

let home = {
  light: false,
  fan: false,
  airCondition: {
    status: false,
    temp: 20
  },
  volumio: {
    playing: false, // 
    volumn: 25
  },
  wire: [true, true, false, true, true]
}

//updating table every 0.5 sec
setInterval(() => {
  yc.request(DBUrl).then((res) => {
    home = res.status;
  }).catch((e) => {
    console.log(e);
  })
}, updateFreq)



////////////////////////////////////////
/////       MQTT controller        /////
////////////////////////////////////////
client.on('connect', () => {
    setInterval(() => {
        client.publish('home/light', `${JSON.stringify({light: home.light})}`)
        client.publish('home/fan', `${JSON.stringify({fan: home.fan})}`)
    }, 500)
})




////////////////////////////////////////
/////       volumio controller     /////
////////////////////////////////////////
let currentVol = 25;
let currentPlaying = false;
socket.emit('volume', currentVol);

setInterval(() => {

    if(currentPlaying !== home.volumio.playing) {
        console.log('playing change!')
        if (home.volumio.playing) {
            socket.emit('play');
        } else {
            socket.emit('pause');
        }
        currentPlaying = home.volumio.playing;
    } 


    if(currentVol !== home.volumio.volumn) {
        console.log('vol changed!')
        socket.emit('volume', home.volumio.volumn);
        currentVol = home.volumio.volumn;
    }

}, updateFreq)

