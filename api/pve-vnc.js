const console = process.console;
router.get('/vnc', (req, res, next) => {
    pve.vncContainer(req.query.id, response => {
        res.json(response);
    });
});



module.exports = router;
