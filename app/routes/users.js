const express = require('express');
const router = express.Router();
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('Time: ', Date.now());
    next();
});

// define the home page route
router.get('/', (req, res) => {
    let result = req.body;
    res.send(result);
});

module.exports = router;