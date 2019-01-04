const https = require('https');

var request = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              let table = JSON.parse(data);
              resolve(table);
            });
          }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    });
}

var func = () => {console.log('sdf')}

module.exports = {func, request}