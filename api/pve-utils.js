const console = process.console;

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'netelipPassword';

router.get('/utils/vnc', (req, res, next) => {
    pve.vncContainer(req.query.id, response => {
        Object.keys(response).forEach((nod) => {
            if (typeof response[nod] == 'object') {
                response = response[nod];
            }
        });
        res.json(response);
    });
});

router.get('/utils/graphic', (req, res, next) => {
    pve.dataContainer(req.query.id, response => {
        Object.keys(response).forEach((nod) => {
            if (typeof response[nod] == 'object') {
                response = response[nod];
            }
        });
        res.json(response);
    });
});

router.get('/utils/ticket', (req, res, next) => {
    pve.ticket(response => {
        res.json(response);
    });
});

router.get('/utils/reloadIP', (req, res, next) => {
    ip_loadPool();
    res.send('ok');
});

router.get('/utils/gentoken', (req, res, next) => {
  try{
    res.json({
        token: encrypt(req.query.id + '-netelip' + new Date().getDay() + new Date().getHours())
    });
  }catch(e){
    res.status(500);
  }
});


module.exports = router;



function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
