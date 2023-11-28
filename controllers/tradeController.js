const model = require('../models/trade');
const userModel = require('../models/user');
const offerModel = require('../models/offer');

exports.index = (req, res)=> {
    model.find()
   .then((trades)=> {
        let categoryArr = []
        trades.forEach(trade => {
        let category = categoryArr.find(trad => trad.category === trade.category);
        if (trade.category == 'SUV'){
            trade.image = '/image/camry.png';
        } else if (trade.category == 'Sedan'){
            trade.image = '/image/civic.jpg';
        } else if (trade.category == 'Luxury'){
            trade.image = '/image/Cars.jpg';
        }
        if(category) {
            if (req.session.user == trade.myProfile || trade.statusPending) {
                // category.trades.push(trade);
            } else {
                category.trades.push(trade);
            }
        }else{
            if (req.session.user == trade.myProfile || trade.statusPending) {
                // do nothing
            } else {
                let newCategory = {};
                newCategory.category = trade.category;
                newCategory.trades = [];
                newCategory.trades.push(trade);
                categoryArr.push(newCategory);
            }
        }
    });
    res.render('./trades', {categoryArr});
   })
   .catch((err)=> next(err));
};

exports.new = (req, res)=>{
    res.render('./newTrade');
};

exports.create = (req, res)=>{

    //res.send('Created a new story');
    let trade = new model(req.body)//create a new story document
    trade.myProfile = req.session.user;
    trade.status = 'Available';
    trade.reviews = [];
    trade.save() //insert the document to the database
    .then((trade)=> { 
        req.flash('success', 'Trade created successfully!');
        console.log(trade);
        return res.redirect('/users/profile');
    }).catch((err)=> {
        if(err.name === 'ValidationError')
        {
            err.status = 400;
            req.flash("error", err.message);
            return res.redirect("back");
        }
        console.log(err);
        next(err);
    });
};

exports.show = (req, res, next) => {

    let id = req.params.id
    //an objectID is a 24-bit hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id ' + id); 
        err.status = 400 
        return next(err)
    }
    model.findById(id)
    .then((trade)=> {
        if(trade)
        {
            if (trade.category == 'SUV'){
                trade.image = '/image/camry.png';
            } else if (trade.category == 'Sedan'){
                trade.image = '/image/civic.jpg';
            } else if (trade.category == 'Luxury'){
                trade.image = '/image/Cars.jpg';
            }
            userModel.find({ _id: req.session.user, watchList: trade._id })
            .then((userUpdate) => {
                if (userUpdate.length > 0) {
                    trade.inWatchlist = true;
                } else {
                    trade.inWatchlist = false;
                }
                model.find({myProfile: req.session.user})
                    .then((cars) => {
                        let reviews=trade.reviews;
                        res.render('./trade',{trade, cars, reviews})
                    }).catch((err)=>next(err))
            }).catch((err)=>next(err))
            // model.find({myProfile: req.session.user})
            // .then((car) => {
            //     res.render('./trade',{trade, car})
            // }).catch((err)=>next(err))
            
        } else { 
            err = new Error('Cannot find a trade with id ' + id)
            err.status = 404 
            next(err)
        }
    })
    .catch((err)=>next(err))
};

exports.makeOffer = (req, res, next) => {
    let id = req.params.id
    //an objectID is a 24-bit hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id ' + id); 
        err.status = 400 
        return next(err)
    }

    model.findById(id)
    .then((trade)=> {
        if(trade)
        {
            if (trade.category == 'SUV'){
                trade.image = '/image/camry.png';
            } else if (trade.category == 'Sedan'){
                trade.image = '/image/civic.jpg';
            } else if (trade.category == 'Luxury'){
                trade.image = '/image/Cars.jpg';
            }
            model.find({myProfile: req.session.user})
            .then((cars) => {
                res.render('./makeOffer',{trade, cars})
            }).catch((err)=>next(err))
            
        } else { 
            err = new Error('Cannot find a trade with id ' + id)
            err.status = 404 
            next(err)
        }
    })
    .catch((err)=>next(err))
}

exports.edit = (req, res, next) => {
    let id = req.params.id
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a trade with id ' + id); 
        err.status = 400 
        return next(err)
    }
    model.findById(id)
    .then((trade)=> { 
        if(trade)
        {
            return res.render('./edit',{trade})
        } else { 
            err = new Error('Cannot find a trade with id ' + id)
            err.status = 404 
            next(err)
        }
    })
    .catch((err)=>next(err))

};

exports.update = (req, res) => {
    /*let trade = req.body;
    let id = req.params.id;
    console.log("updating---------"+ trade + "\n" + trade.model + trade.year + id);
    if (model.updateById(id, trade)) {
        //res.redirect('/trade/'+id);
        trade.id = id;
        trade.image = '/image/civic.jpg'
        console.log("here");
        res.render('./trade', {trade});
    }else{
        res.status(404).send('Cannot find group with id '+id);
    }*/


    let trade = req.body 
    let id = req.params.id
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a story with id ' + id); 
        err.status = 400 
        return next(err)
    }
    model.findByIdAndUpdate(id, trade, {useFindAndModify: false,runValidators: true})
    .then((trade)=> {
        if(trade){
            if (trade.category == 'SUV'){
                trade.image = '/image/camry.png';
            } else if (trade.category == 'Sedan'){
                trade.image = '/image/civic.jpg';
            } else if (trade.category == 'Luxury'){
                trade.image = '/image/Cars.jpg';
            }
            console.log("here");
            req.flash('success', 'Trade updated successfully!');
            res.render('./trade', {trade});
        } else {
            err = new Error('Cannot find a story with id ' + id)
            err.status = 404 ;
            next(err);
        } 
    })
    .catch((err)=> { 
        if(err.name === 'ValidationError')
        {
            err.status = 400;
        }
        return next(err);
    }) 
};

exports.delete = (req, res, next) => {
    /*let id = req.params.id;
    if(model.deleteById(id)) {
        res.redirect("/trades");
    }else{
        let err = new Error('Cannot find a group with id ' + id);
        err.status = 404;
        next(err);
   }*/

   let id = req.params.id
   if(!id.match(/^[0-9a-fA-F]{24}$/)) {
       let err = new Error('Invalid story id ' + id); 
       err.status = 400 
       return next(err)
   }
   offerModel.deleteMany({ $or: [{sender_car: id}, {receiver_car: id}] })
   .then(offerDeleted => {
        model.findByIdAndDelete(id, {useFindAndModify: false})
        .then((trade)=> {
            if (trade)
            {
                req.flash('success', 'Trade deleted successfully!');
                return res.redirect('/users/profile');
            }
            else { 
                err = new Error('Cannot find a trade with id ' + id)
                err.status = 404 
                next(err)
            }
        })
        .catch((err)=> next(err))
   }).catch((err)=> next(err))
   
};

exports.about = (req, res)=>{
    res.render('./about');
};

exports.contact = (req, res)=>{
    res.render('./contact');
};


exports.addWatchList = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a car with id ' + id); 
        err.status = 400 
        return next(err)
    }

    model.findById(id)
    .then((trade) => {
        if(trade._id) {
            userModel.findById(req.session.user)
            .then((user) => {
                let watchArray = user.watchList;
                watchArray.push(trade);
                userModel.findByIdAndUpdate(req.session.user, {watchList: watchArray}, {useFindAndModify: false,runValidators: true})
                .then((updatedUser) => {
                    req.flash('success', 'Added to watch list successfully!')
                    return res.redirect('/users/profile')
                }).catch((err)=>next(err))
            }).catch((err)=>next(err))
        }
    })
    .catch((err)=>next(err))
}

exports.removeWatchList = (req, res) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Cannot find a car with id ' + id); 
        err.status = 400 
        return next(err)  
    }
    userModel.findById(req.session.user)
    .then((user) => {
        let watchArray = user.watchList;
        watchArray = watchArray.filter(obj => obj._id != id);
        userModel.findByIdAndUpdate(req.session.user, {watchList: watchArray}, {useFindAndModify: false,runValidators: true})
        .then((updatedUser) => {
            req.flash('success', 'Removed from watch list!')
            return res.redirect('/users/profile')
        }).catch((err)=>next(err))
    }).catch((err)=>next(err))
};


exports.addReview = async (req, res, next) => {
    let tradeId = req.params.id;
    const { review } = req.body;
    let user = req.session.user;
    console.log("tradeid="+tradeId);
    console.log("user="+user);
    console.log("review="+review);
    try {
      const userInfo=await userModel.findById(user);
      let name=userInfo.firstName;
      // Find the outfit by tradeId
      console.log("name="+name);
      const car_id = model.findById(tradeId);
      console.log("car_id="+car_id);
      if (!car_id) {
        return res.status(404).json({ error: "Car not found" });
      }
      // Create the review object
      const newReview = {
        user,
        name,
        review
      };
      newReview.user = user;
      newReview.name = name;
      newReview.review = review;
      console.log("newReview="+newReview);
      model
        .findByIdAndUpdate(tradeId, { $push: { reviews: newReview } },{ useFindAndModify: false, runValidators: true })
        .then((trade) => {
            req.flash('success', 'Your review is added successfully!')
            console.log("success");
            return res.redirect("/trades")
        })
        .catch((err) => next(err));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
 } ;
