var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const datastore = req.app.locals.datastore;
    console.log(req.query);
    const key = datastore.key(['User', req.query.username]);
    datastore.get(key).then((data) => {
        console.log(data);
        if(data.length == 0) {
            res.send("No User Found!");
        }
        else {
            var user = data[0];
            console.log(user);
            req.session.username = user.name;
            res.send("Success!");
        }
    }).catch((error) => {
        console.log(error);
    })
});

router.post('/', function(req, res, next) {
    const datastore = req.app.locals.datastore;
    console.log(req.query);
    const key = datastore.key(['User', req.query.username]);
    const entity = {
        key: key,
        data: {
            "password": req.query.password,
            "First Name": req.query.first,
            "Last Name": req.query.last
        }
    };
    datastore.save(entity).then((data) => {
        console.log(data);
        res.send("Success!");
    }).catch((error) => {
        console.log(error);
    })
});

module.exports = router;
