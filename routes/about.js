const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('about', {
        'auth':	req.session.username != null,
        "username": req.session.username,
    });
});

module.exports = router;
