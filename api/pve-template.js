const console = process.console;
router.get('/template', (req, res, next) => {
    pve.listTemplates((response) => {
        Object.keys(response).forEach((nod) => {
            if (typeof response[nod] == 'object') {
                response = response[nod];
            }
        });
        res.json(response);
    });
});


module.exports = router;
