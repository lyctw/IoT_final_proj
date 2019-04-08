# Tech Fresh Line Bot應用: 智慧居家系統


## 材料與系統架構
 


材料:
1.	Linkit Smart 7688 Duo
2.	Linkit 7697
3.	DHT22 
4.	Raspberry pi3


![](https://i.imgur.com/MiHA7bl.png)


## Backend Service
後端主要2個程式，皆由Node.js實作，分別是LINE Chat Bot的webhook，以及用來控制家電以及操作溫溼度資料庫的RESTful API
 
 ![](https://i.imgur.com/KbBFrIP.png)


### Webhook

當觸發某個事件（例如用戶加入這個Bot為好友或發送消息時），會向LINE Developers Dashboard上channel配置的webhook URL發送HTTPS POST請求。
Line提供各種語言的SDK，而我們使用了Node.js的linebot npm套件
 
![](https://i.imgur.com/IMWirSM.png)
![](https://i.imgur.com/wQecFZO.png)

 
該套件主要能夠幫助我們解析Line發出的POST request的數位簽章

> **Signature validation**
> The signature in the X-Line-Signature request header must be verified to confirm that the request was sent from the LINE Platform.
Authentication is performed as follows:
> 1.	With the channel secret as the secret key, your application retrieves the digest value in the request body created using the HMAC-SHA256 algorithm.
> 2.	The server confirms that the signature in the request header matches the digest value which is Base64 encoded.

以下是package.json紀錄的版本以及相依套件

```
{
  "name": "iot_final_proj",
  "version": "1.0.0",
  "description": "",
  "engines": {
    "node": "8.9.1"
  },
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/syokujinau/IoT_final_proj.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/syokujinau/IoT_final_proj/issues"
  },
  "homepage": "https://github.com/syokujinau/IoT_final_proj#readme",
  "dependencies": {
    "axios": "^0.18.0",
    "express": "^4.15.2",
    "linebot": "^1.3.0",
    "request": "^2.88.0"
  }
}
```

原始碼: [IoT_final_proj/server.js](https://github.com/syokujinau/IoT_final_proj/blob/master/server.js)
 

### RESTful API
此部分為系統的核心，此後端程式運作一開始會初始化一個table，以及介接資料庫
Table內容如下:

![](https://i.imgur.com/KvcpR5C.png)

 
之後的家電裝置會監看這個table，並在控制Gateway更新這個table的狀態，並做出相應的動作

另一部分是使用MongoDB的NoSQL的資料庫，部屬在Heroku的雲端空間，所以需要搭配mLab這個add-ons來為後端加上mongoDB service

![](https://i.imgur.com/rpf3cGB.png)

 
Free Trial的基本規格如下:
•	RAM: Variable
•	Storage: 496MB
•	Standard driver and REST API support
實際測試使用量，每天存入溫溼度約會耗費100KB，所以理論上這個資料庫在一般使用下能夠運作10年


### mongoose ODM

Node.js 專用的 MongoDB ODM，類似SQL資料庫 schema-based 的方式，來操作MongoDB，model的第二個參數就是schema，基本使用方式如下

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
 
const Cat = mongoose.model('Cat', { name: String });
 
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
```

使用Express.js來做API routing
 
![](https://i.imgur.com/xAimNB9.png)


endpoint以及對應的HTTP request如下
 
![](https://i.imgur.com/s78dj9A.png)


原始碼: [IoT_home_db/server/server.js](https://github.com/syokujinau/IoT_home_db/blob/master/server/server.js) 

可以使用Postman來做localhost測試	
![](https://i.imgur.com/Wl0Km1e.png)

 

### API測試
使用Node.js主流的測試函式庫Mocha搭配expect與supertest就能對這些endpoint發出HTTP request，並檢查他們response的header、HTTP status code

版本號碼如下:
* Mocha	v3.5.3
* Expect	v1.20.2
* Supertest	v2.0.1

![](https://i.imgur.com/cS9RkVz.png)


 
Mocha.js提供一個簡單範例，搭配node.js原生的assert函示庫就能用接近人類語意的方法描述程式行為。

```js
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});
``` 
實際測試過程，描述一個HTTP POST的行為，包含一個測項描述"應該改變電燈狀態"的request以及response

![](https://i.imgur.com/wrMPXz9.png)
<br/>
![](https://i.imgur.com/gNeNGdl.png)




測試程式原始碼: [IoT_home_db/server/tests/server.test.js](https://github.com/syokujinau/IoT_home_db/blob/master/server/tests/server.test.js)
 

### 架設平台與輔助工具

我們使用Heroku這個Platform as a service(PaaS)來架設後端程式，以及各種add-ons為不同需求安裝對應的軟體。
![](https://i.imgur.com/FySHWuj.png)

•	平台即服務(PaaS)
•	支援各種熱門後端語言
•	減少維護管理系統底層的成本
•	免費方案最多可有5個服務
•	Heroku CLI (Deploying with Git)
使用Heroku CLI就上傳檔案到git server，並自動部屬Heroku app，生成HTTPS的URL存取sever的資源。
而在實作LINE Chat Bot的webhook，建議使用ngrok，提供一個HTTPS的URL(因為LINE webhook要求HTTPS協定)，可以在開發階段放到LINE developers的webhook URL，綁定這個執行在本地的webhook，並forwarding到127.0.0.1:3000

![](https://i.imgur.com/EjHwwUD.png)


 
## Chat Bot & Front-end Web
主要兩部分的前端介面，包含LINE Chat Bot與資料視覺化的網頁。首先實作LINE Chat Bot作為主要介面，讓使用者可以下指令來操控家中的物件
實際過程，是由Chat Bot發控一個HTTPS POST到webhook，再由HTTP POST來更新Table，Controller Gateway(下圖橘色區塊)會每0.5秒更新一次Table，再由mqtt來發送到終端裝置LinkIt 7698 + Relay，可參考下圖。

![](https://i.imgur.com/PpxwmYi.png)


LINE Chat Bot介面截圖:
  
![](https://i.imgur.com/1gDMkA7.png)

![](https://i.imgur.com/q80pUjv.png)

![](https://i.imgur.com/H4YSXpv.png)

   

URL: https://radiant-lake-70397.herokuapp.com/


## Controller Gateway
軟體實作的gateway，同樣使用Node.js使用LinkIt Smart 7688 Duo來協調操作的家電裝置、感測器，以及同步後端Table的資料
 
![](https://i.imgur.com/IsUQ7ro.png)


原始碼: [IoT_final_proj/vol_socket/index.js](https://github.com/syokujinau/IoT_final_proj/blob/master/vol_socket/index.js) 
這裡會遇到一個問題是，LinkIt 7688 Duo的記憶體在安裝2個node套件後就會幾近全滿，如下圖
 ![](https://i.imgur.com/7tUgn7K.png)

所以建議要mount File System來擴充可用的記憶體空間。

此外，使用MediaTek官方的韌體只能使用非常早期的node.js版本，所以使用網路上的玩家，在Ubuntu 16.04的環境編譯MIPS架構的Node.js v6，參考這篇文章https://www.joemotacek.com/putting-a-newer-version-of-node-js-on-linkit-smart-7688-duo/
更新韌體後，升級到v6.11.1
 ![](https://i.imgur.com/rS2BtaZ.png)


## 實體物件

* 電器控制: LinkIt 7697 + 繼電器 三組
![](https://i.imgur.com/foGwsks.png)

* 音響控制: Raspberry Pi 3 
![](https://i.imgur.com/RoYDK4k.png)

* 環境感測: LinkIt 7697 + DHT 22 
![](https://i.imgur.com/hpvGZ3X.png)

### 通訊協定

* 電器控制	MQTT
* 音響控制	Websocket
* 環境感測	MQTT

以上裝置控制與溫溼度感測資料蒐集，皆透過Contoller Gateway實作，硬體使用Linkit 7688，主要需要安裝Socket.io以及MQTT Broker。
![](https://i.imgur.com/D26RgSG.png)


* Audio
* HDMI
* I2S + DAC HAT
Source:
* Internal storage
* NAS
* Youtube

實際安裝照片: 
 
![](https://i.imgur.com/LF1GLb3.png)

![](https://i.imgur.com/aSvT1PH.png)


### Volumio Websocket API

Basic Playback Commands
```
**Play:** play
**Pause:** pause
**Stop:** stop
**Previous:** previous
**Next:** next
**Seek** seek N (N is the time in seconds that the playback will keep)
**Random** setRandom(true|false)
**repeat** setRepeat(true|false)
```

Socket.io allows to invoke events triggered by other events, emit and receive communications (on its most basic implementation). As an example, defining which event should be invoked on a client connection looks like:
```js
self.libSocketIO.on('connection', function (connWebSocket) {
  // use connWebSocket here
});
```
This way, we can define what event should be triggered when a particular message is received:
```js
connWebSocket.on('bringmepizza', function () {
  givehimpizza();
});
```
Typically, every message we send or receive to Volumio's Backend will have this structure:
`io.emit('message','data')`;
Where message can be for example "play" and data can be the song number. A good policy for sending data on emits is to configure them as objects: they're easier to parse and easily extendable. So our message can be:
`io.emit('setVolume',{volume:30,mute=false}`

### 環境感測 – DHT22溫濕度

![](https://i.imgur.com/Kk5fd5k.png)

 
上圖是LinkIt7697接收到DHT22的溫溼度資料後，會透過QoS 0的MQTT(Topic: home/dht22)回傳JSON格式字串到Controller Gateway，然後透過HTTP POST向/dht22的endpoint傳送這個字串，儲存到mongoDB的空間中。
 


原始碼:
```cpp
#include <LWiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTPIN A0     // what pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302)

char ssid[] = "SSID";
char password[] = "PWD";
char mqtt_server[] = "192.168.1.152";
char pub_topic[] = "home/dht22";
char client_Id[] = "linkit-7697-dht22";

void callback(char* topic, byte* payload, unsigned int length);

WiFiClient mtclient;     
PubSubClient client(mqtt_server, 1883, callback, mtclient);

DHT dht(DHTPIN, DHTTYPE);

void setup(){
  Serial.begin(9600);
  dht.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  setup_wifi();
  //client.setServer(mqtt_server, 1883);
  if (client.connect("arduinoClient")) {
    //client.publish("outTopic","hello world");
    Serial.println("Broker connected!");
  }
  //client.setCallback(callback);
}

void loop(){
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  //
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(t) || isnan(h)) {
      Serial.println("Failed to read from DHT");
  } else {
      Serial.print("Humidity: "); 
      Serial.print(h);
      Serial.print(" %\t");
      Serial.print("Temperature: "); 
      Serial.print(t);
      Serial.println(" *C");
      char json[50];
      String msg = "{\"temperature\": ";
      msg += (String)t;
      msg += ", \"humidity\": ";
      msg += (String)h;
      msg += "}";
      msg.toCharArray(json, 50);
      client.publish(pub_topic, json);
  }
  
  delay(1500);
}


void printWifiStatus() {                     //print Wifi status
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    // print the received signal strength:
    long rssi = WiFi.RSSI();
    Serial.print("signal strength (RSSI):");
    Serial.print(rssi);
    Serial.println(" dBm");
}

void reconnect() {  //reconnect MQTT
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = client_Id;
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("reconnected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup_wifi() {                       //setup Wifi
   // attempt to connect to Wifi network:
   Serial.print("Attempting to connect to SSID: ");
   Serial.println(ssid);
   WiFi.begin(ssid, password);
   while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
    }
    randomSeed(micros());
    Serial.println("Connected to wifi");
    printWifiStatus();
}

// Callback function
void callback(char* topic, byte* payload, unsigned int length) {
  // In order to republish this payload, a copy must be made
  // as the orignal payload buffer will be overwritten whilst
  // constructing the PUBLISH packet.

  // Allocate the correct amount of memory for the payload copy
  byte* p = (byte*)malloc(length);
  // Copy the payload to the new buffer
  memcpy(p,payload,length);
  client.publish("outTopic", p, length);
  // Free the memory
  free(p);
}
```


## 實作成果
 
* 目標能夠滿足一般家用電器控制，解決市面上智慧插座類型的產品，無法大量布置，即時監看以及自動感測控制的問題。
* 解決方法如上述報告所示，此方法非概念原型設計，包含架構與前後端實作、資料庫架設，都是能夠實際運作的。
* 該專案的環境只需要在具有WiFi的環境，目前家中有架設網路的比率相當高，而此方案不只是用在智慧居家，而是一般公司內部、大賣場等場合能夠應用這種架構實現環境感測、後端管理等等功能。
* 大量部屬家電控制單元可以壓低成本。
* 實作方法如上述。
* 除了硬體以外皆為免費資源。

以市面上一款上圖的智慧插座TP-LINK HS110為範本，目的是解決遠端管理、即時資料監看與大量部屬的成本問題。大量部屬方案，我們提出一個低成本、可複製使用相同程式碼的硬體，即ESP8266系列最小的開發板，同樣可以使用LinkIt7697的PubSubClient函示庫，支援Arduino IDE、有自己的WiFi函示庫並有社群維護，有3個IO腳位最多可以控制3個繼電器，體積小可以容納在插座盒內，適合大量部屬。能夠模仿市面上產品的功能，並提升使用者的便利性，希望未來能夠將整個系統包裝成套裝軟體，讓使用者能夠自行買材料、自行安裝到家中電器設備，增加IoT裝置註冊功能，針對不同的資料來源(例如PM2.5、溫度、IP camera)設計相應的資料結構與後端介接API、資料庫，讓controller gateway與使用者端的介面更有擴展性與多樣性。


## Reference
* TP-LINK Wi-Fi智慧插座 https://www.tp-link.com/tw/products/details/cat-5258_HS110.html
* WebSockets API Reference: https://github.com/volumio/Volumio2/wiki/WebSockets-API-Reference
* LINE Developers Messaging API: https://developers.line.biz/en/docs/messaging-api/overview/
* Linebot npm: https://www.npmjs.com/package/linebot
* MongoDB API Document: https://docs.mongodb.com/manual/contents/
* mLab Add-ons https://elements.heroku.com/addons/mongolab
* Arduino PubSubClient Library: https://github.com/knolleary/pubsubclient
* Data Visualization C3.js:  https://c3js.org/
* MQTT broker mosquito: https://mosquitto.org/
* ES6 Promise MDN web docs: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise
* CORS npm: https://www.npmjs.com/package/cors
* Ngrok local HTTPS Server: https://ngrok.com/docs
* Mocha JavaScript test framework: https://mochajs.org/

