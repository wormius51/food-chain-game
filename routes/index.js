const router = require('express').Router();
const Species = require('../scripts/species');

router.get('/',(req, res, next) => {
    res.render('index');
});

router.get('getSpeciess', (req, res, next) => {
    res.send(Species.speciess);
});

router.get('/getFoodChains', (req, res, next) => {
    res.send(Species.foodChains);
});

module.exports = router;