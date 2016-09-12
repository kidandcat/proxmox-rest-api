const console = process.console;

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'netelipPassword';
var request = require('request');

router.get('/utils/vnc', (req, res, next) => {
    pve.vncContainer(req.query.id, response => {
        Object.keys(response).forEach((nod) => {
            if (typeof response[nod] == 'object') {
                response = response[nod];
            }
        });
        res.json(response);
    });
});

router.get('/utils/graphic', (req, res, next) => {
    pve.dataContainer(req.query.id, response => {
        Object.keys(response).forEach((nod) => {
            if (typeof response[nod] == 'object') {
                response = response[nod];
            }
        });
        res.json(response);
    });
});

router.get('/utils/ticket', (req, res, next) => {
    pve.ticket(response => {
        res.json(response);
    });
});

router.get('/utils/reloadIP', (req, res, next) => {
    ip_loadPool();
    res.send('ok');
});

router.get('/utils/gentoken', (req, res, next) => {
    try {
        res.json({
            token: encrypt(req.query.id + '-netelip' + new Date().getDay() + new Date().getHours())
        });
    } catch (e) {
        res.status(500);
    }
});

router.get('/utils/transfer', (req, res, next) => {
    let VMid = req.query.id;
    let username = req.query.username;

    db.find({
        username: username
    }, function(err, docs) {
        if (docs.length == 0) {
            res.status(400).send('Username "' +username +'" not found!');
            return false;
        }

        db.find({
            machine: VMid
        }, function(err, docsVM) {

            db.find({
                username: docsVM[0].user
            }, function(err, docss) {
                console.log('docs', docss[0]);
                db.update({
                    username: docsVM[0].user
                }, {
                    $set: {
                        machines: docss[0].machines.split(VMid).join('')
                    }
                }, {}, function(err, numReplaced) {
                    if (err) {
                        console.log('ERROR', err.message);
                    }

                    router.handle({
                        url: '/utils/integrity?username=' + docsVM[0].user,
                        method: 'GET'
                    }, {
                        json: (r) => {}
                    }, (r) => {
                        db.update({
                            username: username
                        }, {
                            $set: {
                                machines: ((typeof docs[0].machines != 'undefined') ? docs[0].machines + ':' + VMid : VMid)
                            }
                        }, {}, function(err, numReplaced) {
                            if (err) {
                                console.log('ERROR', err.message);
                            }
                            db.update({
                                machine: VMid
                            }, {
                                $set: {
                                    user: username,
                                    name: docsVM[0].name.split('-:%:-')[0] + '-:%:-' + username
                                }
                            }, {}, function(err, numReplaced) {
                                if (err) {
                                    console.log('ERROR', err.message);
                                }
                                router.handle({
                                    url: '/utils/integrity?username=' + username,
                                    method: 'GET'
                                }, {
                                    json: (r) => {}
                                }, (r) => {
                                    //console.log('R', r);
                                });
                            });
                        });
                    });
                });
            });
            pve.modifyContainer(VMid, {
                description: docsVM[0].name.split('-:%:-')[0] + '-:%:-' + username,
            }, (r) => {
                res.json(r);
            });
        });
    });
});

router.get('/utils/integrity', (req, res, next) => {
    if (req.query.username) {
        res.send('OK');
        db.find({
            username: req.query.username
        }, function(err, docs) {
            if (err || docs.length == 0) {
                console.log('ERROR', err);
                res.status(400).json(err);
                return false;
            }
            try {
                while (docs[0].machines.charAt(0) == ':') {
                    docs[0].machines = docs[0].machines.substring(1);
                }
            } catch (e) {}

            if (!docs || !docs[0] || !docs[0].machines || docs[0].machines.split(':')[0] == '') {
                return false;
            }
            let data = [];

            db.update({
                username: req.query.username
            }, {
                $set: {
                    machines: cleanArray(docs[0].machines.split(':')).join(':')
                }
            }, {}, function(err, numReplaced) {
                if (err) {
                    console.log('ERROR', err.message);
                }
                cleanArray(docs[0].machines.split(':')).forEach(function(id) {
                    db.find({
                        machine: id
                    }, function(err, docsVM) {
                        if (typeof docsVM[0] == 'undefined' || typeof docsVM[0].user == 'undefined' || docsVM[0].user != req.query.username) {
                            db.update({
                                username: req.query.username
                            }, {
                                $set: {
                                    machines: docs[0].machines.split(id).join('')
                                }
                            }, {}, function(err, numReplaced) {

                            });
                        } else {
                            pve.statusContainer(id, (response) => {

                                Object.keys(response).forEach((nod) => {
                                    if (typeof response[nod] == 'object') {
                                        response = response[nod];
                                    }
                                });


                                pve.networkContainer(id, (response2) => {

                                    Object.keys(response2).forEach((nod) => {
                                        if (typeof response2[nod] == 'object') {
                                            Object.keys(response2[nod].data).forEach((nodd) => {
                                                response.data[nodd] = response2[nod].data[nodd];
                                            });
                                        }
                                    });
                                    data.push(response);

                                    if (data.length == cleanArray(docs[0].machines.split(':')).length) {
                                        data.forEach((d) => {
                                            if (typeof d.data === 'undefined') {
                                                console.log('Lost Machine ' + id);
                                                router.handle({
                                                    url: '/container',
                                                    method: 'DELETE',
                                                    body: {
                                                        id: id
                                                    }
                                                }, {
                                                    json: (r) => {}
                                                }, (r) => {
                                                    //console.log('R', r);
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            });
        });
    }
});


module.exports = router;



function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    var uniqueArray = newArray.filter(function(elem, pos) {
        return newArray.indexOf(elem) == pos;
    })
    return uniqueArray;
}
