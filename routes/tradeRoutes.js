const express = require('express');
const controller = require('../controllers/tradeController.js')
//const {isLoggedIn, isAuthor, isValidRsvp, isConnPresent} =  require('../middlewares/auth');
//const {validateId, validateConnection, validateResult} = require('../middlewares/validator');

const {isLoggedIn, isAuthor} =  require('../middlewares/auth');
const {validateId, validateTrade} = require('../middlewares/validator');


const router = express.Router();


router.get('/', controller.index);

router.get('/new', isLoggedIn,  controller.new);

router.post('/',  isLoggedIn, validateTrade, controller.create);

router.get('/:id', validateId, controller.show);

router.get('/:id/makeOffer', validateId, isLoggedIn, controller.makeOffer);

router.post('/:id/watchlist', validateId, isLoggedIn, controller.addWatchList);

router.post('/:id/deleteWatchlist', validateId, isLoggedIn, controller.removeWatchList);

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

router.put('/:id', validateId, isLoggedIn, isAuthor, validateTrade,  controller.update);

router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);



//router.post('/:id',  isLoggedIn, isConnPresent, isValidRsvp, controller.rsvp);

//router.delete('/:id/rsvp', isLoggedIn, isConnPresent, controller.deleteRsvp);

module.exports = router;