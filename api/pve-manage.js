const console = process.console;
router.post('/manage/on', (req, res, next) => {
    pve.startContainer(req.body.id, (response) => {
        res.json(response);
    });
});

router.post('/manage/off', (req, res, next) => {
    pve.stopContainer(req.body.id, (response) => {
        res.json(response);
    });
});


module.exports = router;
