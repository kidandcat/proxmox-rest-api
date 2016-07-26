/////////////////
// DON'T TOUCH //
/////////////////

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


module.exports = router;
