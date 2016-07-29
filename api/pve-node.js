const console = process.console;
router.report('/node', (req, res, next) => {
    pve.nodeStatus((response) => {
        res.json(response);
    });
});


module.exports = router;
