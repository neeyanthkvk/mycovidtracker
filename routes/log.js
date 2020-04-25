var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const datastore = req.app.locals.datastore;
    const query = datastore
    .createQuery('Logs')
    .filter('username', '=', req.session.username);
    datastore.runQuery(query).then(([tasks]) => {
        console.log('Tasks:');
        tasks.forEach(task => console.log(task));
    }).catch((error) => {
        console.log(error);
        res.send("Some Error Occured");
    })
});

router.post('/', function(req, res, next) {
    const datastore = req.app.locals.datastore;
    const key = datastore.key(['User', req.body.username]);
    const entity = {
        key: key,
        data: {
            "password": req.body.password,
            "First Name": req.body.first,
            "Last Name": req.body.last,
            "admin": false
        }
    };
    datastore.save(entity).then((data) => {
        res.send("Success!");
    }).catch((error) => {
        console.log(error);
    })
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
