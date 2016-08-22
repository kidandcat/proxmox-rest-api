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

router.get('/cluster/nextip', (req, res, next) => {
    res.json({"ip": ipPool.pool[ip_nextIp()].ip});
});

router.get('/cluster/ip', (req, res, next) => {
    ip_releaseIp(req.query.ip);
    res.json("ok");
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
