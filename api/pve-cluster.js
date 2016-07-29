const console = process.console;
router.report('/cluster', (req, res, next) => {
    pve.status(response => {
        res.json(response);
    });
});

router.get('/cluster/nextid', (req, res, next) => {
    pve.nextId(response => {
        res.json(response);
    });
});

router.get('/cluster', (req, res, next) => {
    db.find({
        destroy: /./
    }, function(err, docs) {
        res.json(docs);
    });
});

router.delete('/cluster', (req, res, next) => {
    db.find({
        destroy: /./
    }, function(err, docs) {
        docs.forEach(ma => {
            pve.deleteContainer(ma.destroy, () => {});
            db.remove({
                destroy: ma.destroy
            }, {}, () => {});
        });
    });
    res.send('OK');
});




module.exports = router;
