const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
    console.log(req.query)
    if('data' in req.query) {
        const datastore = req.app.locals.datastore;
        const query = datastore
        .createQuery('Logs')
        .filter('username', '=', req.session.username);
        datastore.runQuery(query).then(([logs]) => {
            res.send({
                'logs': logs
            });
        }).catch((error) => {
            console.log(error);
            res.send("Some Error Occured");
        })
    }
    else {
        res.render('tracking', {
            'auth':	req.session.username != null,
            "username": req.session.username,
        });
    }
});

router.post('/', (req, res) => {
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

router.delete("/", (req, res) => {
    try {
        req.session = null;
        res.send("You have Logged Out");
    }
    catch(err) {
        console.log(err)
    }
})

module.exports = router;
