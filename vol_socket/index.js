var io = require('socket.io-client');
var axios = require('axios');
var socket = io.connect('http://192.168.1.105:3000');

const fbUrl = 'https://iot-proj-b0c12.firebaseio.com/volumio.json';
let status = false;
// axios.get(fbUrl)
//   .then(function (response) {
//     console.log(response.data); 
//   })
//   .catch(function (error) { 
//     console.log(error);
//   });

socket.emit('volume', 25);

// socket.emit('getState', '')
// socket.on('pushState', function(data) {
//     console.log(data.status);
    // if (data.status === 'pause') {
    //     socket.emit('play');
    // } 
    // socket.emit('getState', '')
    // if(status === true) {
    //     socket.emit('play');
    // } else {
    //     socket.emit('pause');
    // }
//   }
// );

setInterval(function() {
    axios.get(fbUrl)
        .then(function (response) {
            // console.log(response.data.play); 
            // status = response.data.play;
            if(response.data.play)  {
                socket.emit('play');
                socket.emit('volume', response.data.volume);
            } else {
                socket.emit('pause');
            }
        })
        .catch(function (error) { 
            console.log(error);
        });
}, 500)






// var cnt = 10;
// setInterval(function(){
//     socket.emit('volume', cnt++);
// }, 1000);
