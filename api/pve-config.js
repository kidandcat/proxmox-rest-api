/////////////////
// DON'T TOUCH //
/////////////////

const console = process.console;
express = require('express');
router = express.Router();
path = require('path');
pve = require('../lib/proxmox')(require('../config/api.json'));


const Datastore = require('nedb');
db = new Datastore({
    filename: './data/users.db',
    autoload: true
});
db.persistence.setAutocompactionInterval(10000);
db.ensureIndex({ fieldName: 'destroy', unique: true, sparse: true }, function (err) {
  if(err){console.log('ERROR', err)};
});
db.ensureIndex({ fieldName: 'username', unique: true, sparse: true }, function (err) {
  if(err){console.log('ERROR', err)};
});
db.ensureIndex({ fieldName: 'machine', unique: true, sparse: true }, function (err) {
  if(err){console.log('ERROR', err)};
});

module.exports = router;
