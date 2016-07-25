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




module.exports = router;
