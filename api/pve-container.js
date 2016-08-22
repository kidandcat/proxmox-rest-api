const console = process.console;
router.delete('/container', (req, res, next) => {
    pve.stopContainer(req.body.id, (response) => {
        res.json({
            message: "Machine status changed to destroy"
        });


        db.find({
            machine: req.body.id
        }, function(err, docs) {
            if (docs.length > 0) {
                db.find({
                    username: docs[0].user
                }, function(err, docs) {
                    try {
                        db.update({
                            username: docs[0].username
                        }, {
                            $set: {
                                machines: cleanArray((docs[0].machines.split(req.body.id).join('')).split(':')).join(':')
                            }
                        }, {}, function(err, numReplaced) {
                            if (err) {
                                console.log('ERROR22 update machines field - ' + numReplaced, err.message);
                            }
                        });
                    } catch (e) {}

                    db.remove({
                        machine: req.body.id
                    }, {
                        multi: true
                    }, function(err, numRemoved) {
                        if (err) {
                            console.log('ERROR31 remove machine - ' + req.body.id, err.message);
                        }
                    });
                });
            }
        });

        db.insert({
            destroy: req.body.id,
            date: new Date()
        }, (err) => {
            if (err) {
                console.log('ERROR42', err.message);
            }
        });
    });
});

router.get('/container', (req, res, next) => {
    if (req.query.username) {
        db.find({
            username: req.query.username
        }, function(err, docs) {
            if (err || docs.length == 0) {
                console.log('ERROR56', err);
                res.status(400).json(err);
                return false;
            }
            try {
                while (docs[0].machines.charAt(0) == ':') {
                    docs[0].machines = docs[0].machines.substring(1);
                }
            } catch (e) {}

            if (!docs || !docs[0] || !docs[0].machines || docs[0].machines.split(':')[0] == '') {
                res.json({});
                return false;
            }
            let data = [];

            cleanArray(docs[0].machines.split(':')).forEach(function(id) {
                pve.statusContainer(id, (response) => {

                    Object.keys(response).forEach((nod) => {
                        if (typeof response[nod] == 'object') {
                            response = response[nod];
                        }
                    });
                    data.push(response);
                    if (data.length == cleanArray(docs[0].machines.split(':')).length) {
                        res.json(data);
                    }
                });
            });
        });
    } else if (req.query.id) {
        pve.statusContainer(req.query.id, (response) => {
            Object.keys(response).forEach((nod) => {
                if (typeof response[nod] == 'object') {
                    response = response[nod];
                }
            });
            res.json(response);
        });
    } else {
        res.status(400).json({
            Error: "You must specify machine ID or username"
        });
    }
});

router.post('/container', (req, res, next) => {
    if (typeof req.body.username == 'undefined') {
        res.status(400).json({
            Error: "Username must be provided"
        });
    } else {
        db.find({
            username: req.body.username
        }, function(err, docs) {
            if (docs.length > 0) {
                pve.createContainer({
                    template: req.body.template,
                    hostname: req.body.hostname,
                    cpu: req.body.cpu,
                    memory: req.body.memory,
                    ostype: req.body.ostype,
                    storage: req.body.storage,
                    swap: req.body.swap,
                    disk: req.body.disk,
                    net: `name=eth0,ip=${ip_getIp()}/24,bridge=vmbr0`,
                    password: docs[0].password
                }, (response) => {
                    if (typeof response.data != 'undefined' && response.data.substring(0, 4) == 'UPID') {
                        let id = response.data.split('vzcreate:')[1].split(':')[0];
                        setTimeout(() => {
                            pve.startContainer(id, () => {});
                        }, 20000);

                        db.insert({
                            machine: id,
                            user: req.body.username
                        }, (err) => {
                            if (err) {
                                console.log('ERROR110', err.message);
                            }
                        });
                        db.update({
                            username: req.body.username
                        }, {
                            $set: {
                                machines: ((typeof docs[0].machines != 'undefined') ? docs[0].machines + ':' + id : id)
                            }
                        }, {}, function(err, numReplaced) {
                            if (err) {
                                console.log('ERROR121', err.message);
                            }
                        });
                        res.json({
                            id: id
                        });
                    } else {
                        res.status(400).json(response);
                    }

                });
            } else {
                res.status(400).json({
                    Error: "User not found"
                });
            }
        });
    }
});



module.exports = router;




function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
