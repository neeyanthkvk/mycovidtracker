const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
    const datastore = req.app.locals.datastore;
    const key = datastore.key(['User', req.query.username]);
    datastore.get(key).then((data) => {
        if(data.length == 0) {
            res.send("No User Found!");
        }
        else {
            var user = data[0];
            if(user.password == req.query.password) {
                req.session.username = req.query.username
                res.send("Success!");
            }
            else {
                res.send("Wrong Password");
            }
        }
    }).catch((error) => {
        console.log(error);
        res.send("Some Error Occured");
    })
});

router.post('/', (req, res) => {
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
