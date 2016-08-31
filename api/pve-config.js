/////////////////
// DON'T TOUCH //
/////////////////

const console = process.console;
express = require('express');
fs = require('fs');
router = express.Router();
path = require('path');
pve = require('../lib/proxmox')(require('../config/api.json'));
IPFILE = '../config/ip.json';
ipPool = require(IPFILE);

const Datastore = require('nedb');
db = new Datastore({
    filename: './data/users.db',
    autoload: true
});
db.persistence.setAutocompactionInterval(10000);
db.ensureIndex({
    fieldName: 'destroy',
    unique: true,
    sparse: true
}, function(err) {
    if (err) {
        console.log('ERROR', err)
    };
});
db.ensureIndex({
    fieldName: 'username',
    unique: true,
    sparse: true
}, function(err) {
    if (err) {
        console.log('ERROR', err)
    };
});
db.ensureIndex({
    fieldName: 'machine',
    unique: true,
    sparse: true
}, function(err) {
    if (err) {
        console.log('ERROR', err)
    };
});

module.exports = router;




ip_nextIp = () => {
  for(let ipp of ipPool.pool){
    if(ipp.free && !ipp.lock){
      return ipPool.pool.indexOf(ipp);
    }
  }
  return Number(-1);
}

ip_findIp = (ip) => {
  for(let ipp of ipPool.pool){
    if(ipp.ip == ip){
      return ipPool.pool.indexOf(ipp);
    }
  }
  return Number(-1);
}

ip_getIp = () => {
    let free = ip_nextIp();
    if(free !== -1){
      ipPool.pool[free].free = false;
      ip_saveIpPool();
      return ipPool.pool[free].ip;
    }else{
      console.log('!¡! FATAL ERROR, NOT IPs LEFT IN IP POOL !¡!');
      return "127.0.0.1";
    }
}

ip_releaseIp = (ip) => {
    let free = ip_findIp(ip);
    console.log('free', free);
    if(free !== -1){
      ipPool.pool[free].free = true;
    }
    ip_saveIpPool();
}

ip_saveIpPool = () => {
  fs.writeFile('./config/ip.json', JSON.stringify(ipPool,null, 2), function(err) {
      if (err) {
          console.log(err);
          throw new Error(err);
      }
  });
}

ip_loadPool  = () => {
  ipPool = require(IPFILE);
}
