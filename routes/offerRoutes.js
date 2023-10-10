const express = require('express');
const controller = require('../controllers/offerController.js')


const {isLoggedIn, isAuthor} =  require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');


const router = express.Router();

router.post('/', isLoggedIn, controller.create);
router.get('/received', isLoggedIn, controller.received);
router.get('/sent', isLoggedIn, controller.sent);
router.put('/:id', isLoggedIn, controller.update);
router.delete('/:id', isLoggedIn, controller.delete);

module.exports = router;