const model = require('../models/offer');
const tradeModel = require('../models/trade');
const offerModel = require('../models/offer');

exports.create = (req, res) => {
  const { sender, receiver, sender_car, receiver_car } = req.body;

  offerModel.findOne({ sender_car, receiver_car })
    .then(offerSearch => {
      // console.log("Offer Search: ", offerSearch);
      if (offerSearch) {
        offerModel.findByIdAndUpdate(offerSearch._id, {status: 'pending'})
          .then(offerUpdate => {
            tradeModel.findByIdAndUpdate(sender_car, { statusPending: true, status: 'pending' })
              .then(updatedTrade => {
                req.flash('success', 'Made offer successfully!');
                return res.redirect('/users/profile');
              }).catch((err) => next(err))
          })
      } else {
        const offer = new model({
          sender,
          receiver,
          sender_car,
          receiver_car,
          status: 'pending',
        });

        offer.save()
          .then(savedOffer => {
            tradeModel.findByIdAndUpdate(sender_car, { statusPending: true, status: 'pending' })
              .then(updatedTrade => {
                req.flash('success', 'Made offer successfully!');
                return res.redirect('/users/profile');
              }).catch((err) => next(err))
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              err.status = 400;
            }
            next(err)
          })
      }
    }).catch((err) => next(err))
}

exports.received = (req, res) => {
  const userId = req.session.user;

  model.find({ receiver: userId })
    .populate('sender')
    .populate('receiver')
    .populate('sender_car')
    .populate('receiver_car')
    .exec()
    .then(offers => {
      res.status(201).json(offers);
      // res.render('received-offers', { offers });
    })
    .catch((err) => next(err))
}

exports.sent = (req, res) => {
  const userId = req.session.user;

  model.find({ sender: userId })
    .populate('sender')
    .populate('receiver')
    .populate('sender_car')
    .populate('receiver_car')
    .exec()
    .then(offers => {
      res.status(201).json(offers);
      // res.render('received-offers', { offers });
    })
    .catch((err) => next(err))
}

exports.update = (req, res) => {
  const userId = req.session.user;
  const { status } = req.body;
  const id = req.params.id;

  model.findByIdAndUpdate(id, { status: `${status}` }, { useFindAndModify: false, runValidators: true })
    .then((updatedOffer) => {
      console.log("Update offer: ", updatedOffer);
      if (status == 'cancelled' || status == 'declined') {
        tradeModel.findByIdAndUpdate(updatedOffer.sender_car, { statusPending: false, status: 'available' })
          .then(updateTrade => {
            console.log(updateTrade._id);
          }).catch((err) => { console.log(err) })
      }
      if (status == 'pending') {
        tradeModel.findByIdAndUpdate(updatedOffer.sender_car, { statusPending: true, status: 'pending' })
          .then(updateTrade => {
            console.log(updateTrade._id);
          }).catch((err) => { console.log(err) })
      }
      if (status == 'accepted') {
        tradeModel.findByIdAndUpdate(updatedOffer.sender_car, { statusPending: true, status: 'traded' })
        .then(updateTrade => {
          // console.log(updateTrade._id);
        }).catch((err) => { console.log(err) })
        tradeModel.findByIdAndUpdate(updatedOffer.receiver_car, { statusPending: true, status: 'traded' })
        .then(updateTrade => {
          // console.log(updateTrade._id);
        }).catch((err) => { console.log(err) })
      }
      req.flash('success', `${status == 'pending' ? 'Made' : status} offer successfull!`)
      return res.redirect('/users/profile')
    }).catch((err) => { console.log(err) })
}


exports.delete = (req, res, next) => {
  let id = req.params.id
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error('Invalid story id ' + id);
    err.status = 400
    return next(err)
  }
  model.findByIdAndDelete(id, { useFindAndModify: false })
    .then((offer) => {
      console.log("OFFER: ", offer);
      if (offer) {
        tradeModel.findByIdAndUpdate(offer.sender_car, { statusPending: false, status: 'available' })
          .then(tradeUpdate => {
            req.flash('success', 'Deleted Offer successfully.')
            return res.redirect('/users/profile')
          })

      }
      else {
        err = new Error('Cannot find a trade with id ' + id)
        err.status = 404
        next(err)
      }
    })
    .catch((err) => next(err))
};