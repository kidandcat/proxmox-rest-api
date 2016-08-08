const console = process.console;
router.get('/user', (req, res, next) => {
    if (typeof req.query.username == 'undefined') {
        db.find({
          username: /./
        }, function(err, docs) {
            res.json(docs);
        });
    } else {
        db.find({
            username: req.query.username
        }, function(err, docs) {
            res.json(docs);
        });
    }
});

router.put('/user', (req, res, next) => {
    db.update({
        username: req.body.username
    }, {
        username: req.body.username,
        password: req.body.password
    }, {}, function(err, numReplaced) {
        if (!err) {
            if (numReplaced > 0) {
                res.send('OK');
            } else {
                res.status(400).json('Target was not found.');
            }
        } else {
            res.status(500).json(err);
        }
    });
});

router.post('/user', (req, res, next) => {
    let doc = {
        username: req.body.username,
        password: req.body.password
    };

    db.find({
        username: req.query.username
    }, function(err, docs) {
        if (docs.length > 0) {
            res.status(400).json({
                Error: "The user already exists, please use PUT method to update it."
            });
        } else {
            db.insert(doc);
            res.send('OK');
        }
    });
});

router.delete('/user', (req, res, next) => {
    db.remove({
        username: req.body.username
    }, {}, function(err, numRemoved) {
        if (!err) {
            res.send('OK');
        } else {
            res.status(500).json(err);
        }
    });
    //TODO:Delete machines
});



module.exports = router;
