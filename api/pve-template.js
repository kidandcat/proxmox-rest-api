const console = process.console;
router.get('/template', (req, res, next) => {
    pve.listTemplates((response) => {
        res.json(response);
    });
});


module.exports = router;
