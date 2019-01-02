// 192.168.1.152
const io = require('socket.io-client');
const yc = require('./req-promise');
const https = require('https');
const mqtt = require('mqtt');

var socket = io.connect('http://192.168.1.105:3000');
var client = mqtt.connect('mqtt://192.168.1.152');

const DBUrl = 'https://radiant-lake-70397.herokuapp.com/home/status';

let home = {
  light: false,
  fan: false,
  airCondition: {
    status: false,
    temp: 20
  },
  volumio: {
    playing: false, // 
    volumn: 30
  },
  wire: [true, true, false, true, true]
}

setInterval(() => {}, 500)


client.on('connect', () => {
    setInterval(() => {
        client.publish('home/light', `${JSON.stringify({light: home.light})}`)
    }, 1000)
})



let newVol = 25;
socket.emit('volume', newVol);

setInterval(() => {


https.get(DBUrl, (resp) => {
  let data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let table = JSON.parse(data);
    // console.log(table);
    home = table.status;


    if(home.volumio.playing === true) {
        socket.emit('play');
    } else if (home.volumio.playing === false) {
        socket.emit('pause');
    } else {
      console.log('nothing')
    }

    
    if(newVol !== home.volumio.volumn) {
        console.log('vol changed!')
        socket.emit('volume', home.volumio.volumn);
        newVol = home.volumio.volumn;
    }



  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});




}, 800);

