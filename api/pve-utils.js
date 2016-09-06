const console = process.console;

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'netelipPassword';
var request = require('request');

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

router.get('/utils/integrity', (req, res, next) => {
  if (req.query.username) {
      db.find({
          username: req.query.username
      }, function(err, docs) {
          if (err || docs.length == 0) {
              console.log('ERROR', err);
              res.status(400).json(err);
              return false;
          }
          try {
              while (docs[0].machines.charAt(0) == ':') {
                  docs[0].machines = docs[0].machines.substring(1);
              }
          } catch (e) {}

          if (!docs || !docs[0] || !docs[0].machines || docs[0].machines.split(':')[0] == '') {
              res.json({});
              return false;
          }
          let data = [];

          cleanArray(docs[0].machines.split(':')).forEach(function(id) {
              pve.statusContainer(id, (response) => {

                  Object.keys(response).forEach((nod) => {
                      if (typeof response[nod] == 'object') {
                          response = response[nod];
                      }
                  });


                  pve.networkContainer(id, (response2) => {

                      Object.keys(response2).forEach((nod) => {
                          if (typeof response2[nod] == 'object') {
                              Object.keys(response2[nod].data).forEach((nodd) => {
                                  response.data[nodd] = response2[nod].data[nodd];
                              });
                          }
                      });
                      data.push(response);

                      if (data.length == cleanArray(docs[0].machines.split(':')).length) {
                        data.forEach((d) => {
                          if(typeof d.data === 'undefined'){
                            console.log('Lost Machine ' + id);
                            router.handle({ url: '/container', method: 'DELETE',body: {id: id} }, {json: (r)=>{} }, (r) => {
                              //console.log('R', r);
                            });
                          }
                        });
                        res.send('OK');
                      }
                  });
              });
            });
        });
    }
});


module.exports = router;



function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
