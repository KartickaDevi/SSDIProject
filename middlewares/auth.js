const Trade = require('../models/trade');


// continues if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
      return next();
    }else{
        req.flash('error','You are logged in already');
        return res.redirect('/users/profile');
    }
};


// continues if user is aunthenicated
exports.isLoggedIn = (req, res, next)=>{
  if(req.session.user){
    return next();
  }else{
      req.flash('error','You need to log in first');
      return res.redirect('/users/login');
  }
};



//check if user is owner of the trade
exports.isAuthor = (req, res, next) => {
  let cid = req.params.id;
  Trade.findById(cid)
  .then(trade=>{
    console.log("checking is author");
    console.log(req.session.user);
    console.log(trade.myProfile);
    if(trade){
      if(trade.myProfile == req.session.user) {
        return next();
      }else{
        let err = new Error('Unauthorised to access the resource');
        err.status = 401;
        return next(err);
      }
    }
    else {
      let err = new Error('Cannot find a trade with id ' + req.params.id);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err=>next(err));
};



exports.isTradePresent = (req, res, next) => {
  let cid = req.params.id;
  Trade.findById(cid)
  .then(conn=>{
    if(conn){
      return next();
    }
    else {
      let err = new Error('Cannot find a trade with id ' + req.params.id);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err=>next(err));
}



