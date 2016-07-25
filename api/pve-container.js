router.delete('/container', (req, res, next) => {
    pve.deleteContainer(req.body.id, (response) => {
        res.json(response);
    });

    db.find({
        machine: req.body.id
    }, function(err, docs) {
        db.find({
            username: docs[0].user
        }, function(err, docs) {
            db.update({
                username: docs[0].username
            }, {
                $set: {
                    machines: docs[0].machines.split(':' + req.body.id).join('')
                }
            }, {}, function(err, numReplaced) {
                if (err) {
                    console.log('ERROR', err);
                }
            });

            db.remove({
                machine: req.body.id
            }, {}, function(err, numRemoved) {
                if (err) {
                    console.log('ERROR', err);
                }
            });
        });
    });
});

router.get('/container', (req, res, next) => {
    if (req.query.username) {
        db.find({
            username: req.query.username
        }, function(err, docs) {
            let data = [];
            docs[0].machines.split(':').forEach(function(id) {
                pve.statusContainer(id, (response) => {
                    data.push(response);
                    if (data.length == docs[0].machines.split(':').length) {
                        res.json(data);
                    }
                });
            });
        });
    } else if (req.query.id) {
        pve.statusContainer(req.query.id, (response) => {
            res.json(response);
        });
    } else {
        res.status(400).json({
            Error: "You must specify machine id or username"
        });
    }
});

router.post('/container', (req, res, next) => {
    if (typeof req.body.username == 'undefined') {
        res.status(400).json({
            Error: "Username must be provided!"
        });
    } else {
        db.find({
            username: req.body.username
        }, function(err, docs) {
            if (docs.length > 0) {
                pve.createContainer({
                    template: req.body.template,
                    cpu: req.body.cpu,
                    hostname: req.body.hostname,
                    memory: req.body.memory,
                    ostype: req.body.ostype,
                    storage: req.body.storage,
                    swap: req.body.swap,
                    disk: req.body.disk,
                    password: docs[0].password
                }, (response) => {
                    if (response.data.substring(0, 4) == 'UPID') {
                        let id = response.data.split('vzcreate:')[1].split(':')[0];
                        db.insert({
                            machine: id,
                            user: req.body.username
                        });
                        db.update({
                            username: req.body.username
                        }, {
                            $set: {
                                machines: ((typeof docs[0].machines != 'undefined') ? docs[0].machines + ':' + id : id)
                            }
                        }, {}, function(err, numReplaced) {
                            if (err) {
                                console.log('ERROR', err);
                            }
                        });
                    }
                    res.json(response);
                });
            } else {
                res.status(400).json({
                    Error: "User not found."
                });
            }
        });
    }
});



module.exports = router;
