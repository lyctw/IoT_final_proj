const yc = require('./req-promise');

yc.func();

// yc.request('https://radiant-lake-70397.herokuapp.com/home/status').then((res) => {
//     console.log(res);
// }).catch((e) => {
//     console.log(e)
// })
(async () => {
    let data = await yc.request('https://radiant-lake-70397.herokuapp.com/home/status')
    console.log(data)
})()

