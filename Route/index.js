const express = require('express');
const router = express.Router();

// Get hompage

router.get('/', (req, res, next)=>{
    res.render('index', {title: 'Express'});
});

module.exports = router;