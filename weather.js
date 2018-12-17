var rp = require('request-promise');
 
// const SITE_NAME = '西屯';
const opts = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
};

var getPM25 = (place) => {

    return new Promise((resolve, reject) => {
        rp(opts).then(function (repos) {
            let data;
            console.log(repos)
            for (i in repos) {
                if (repos[i].SiteName == place) {
                    data = repos[i];
                    break;
                }
            }
            if(data) {
                resolve(data);
            } else {
                reject('no sensor');
            }
            
        })
        .catch(function (err) {
            reject('出錯了～找不到指定資源…');
        });
    })

}
 


module.exports = {
    getPM25
}