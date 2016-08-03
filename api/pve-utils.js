const console = process.console;
router.get('/utils/vnc', (req, res, next) => {
    pve.vncContainer(req.query.id, response => {
        res.json(response);
    });
});

router.get('/utils/graphic', (req, res, next) => {
    pve.dataContainer(req.query.id, response => {
        res.json(response);
    });
});

router.get('/utils/ticket', (req, res, next) => {
    pve.ticket(response => {
        res.json(response);
    });
});


module.exports = router;
