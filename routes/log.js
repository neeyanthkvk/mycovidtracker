var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const datastore = req.app.locals.datastore;
    const query = datastore
    .createQuery('Logs')
    .filter('username', '=', req.session.username);
    datastore.runQuery(query).then(([logs]) => {
        console.log('Logs:');
        logs.forEach(task => console.log(task.body));
        res.render('log', {'logs': logs});
    }).catch((error) => {
        console.log(error);
        res.send("Some Error Occured");
    })
});

router.post('/', function(req, res, next) {
    try {
        const datastore = req.app.locals.datastore;
        const key = datastore.key(['Logs']);
        const entity = {
            key: key,
            data: {
                username: req.session.username,
                time: new Date().toISOString(),
                body: req.body
            }
        };
        datastore.save(entity).then((data) => {
            res.send("Success!");
        }).catch((error) => {
            console.log(error);
            res.send(error);
        })
    }
    catch(err) {
        console.log(err);
    }
});

router.delete("/", function(req, res, next) {
    try {
        req.session = null;
        res.send("You have Logged Out");
    }
    catch(err) {
        console.log(err)
    }
})

module.exports = router;
