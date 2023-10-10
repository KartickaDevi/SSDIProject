const model = require('../models/user');
const tradeModel = require('../models/trade');
const offerModel = require('../models/offer');


exports.new = (req, res)=>{
    res.render('./users/new');
};


exports.create = (req, res, next)=>{
    let user = new model(req.body);//create a new user document
    user.save()//insert the document to the database
    .then(user=> {
        req.flash('success', 'You have signed up successfully!');
        return res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }
        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('/users/new');
        }
        next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
    res.render('./users/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email) {
        email = email.toLowerCase();
    }
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
                req.flash('error', 'wrong email address');  
                res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.firstName = user.firstName;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong password');    
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    console.log("inside usercontroller profile");
    console.log(id);
    Promise.all([model.findById(id).populate('watchList').exec(), tradeModel.find({myProfile: id}), offerModel.find({ sender: id }).populate('sender').populate('receiver').populate('sender_car').populate('receiver_car').exec(), offerModel.find({ receiver: id }).populate('sender').populate('receiver').populate('sender_car').populate('receiver_car').exec() ])
    .then(result=>{
        const [user, trades, sender, receiver] = result;
        console.log(user);
        console.log(trades);
        console.log(sender);
        console.log(receiver);
        trades.forEach(trade => {
            if (trade.category == 'SUV'){
                trade.image = '/image/camry.png';
            } else if (trade.category == 'Sedan'){
                trade.image = '/image/civic.jpg';
            } else if (trade.category == 'Luxury'){
                trade.image = '/image/Cars.jpg';
            }
            const searchIndex = sender.findIndex((car) => car.sender_car == trade._id);
            if(searchIndex > -1) {
                // sender[searchIndex].statusPending = trade.statusPending;
            }
        });
        user.watchList.forEach(saved => {
            if (saved.category == 'SUV'){
                saved.image = '/image/camry.png';
            } else if (saved.category == 'Sedan'){
                saved.image = '/image/civic.jpg';
            } else if (saved.category == 'Luxury'){
                saved.image = '/image/Cars.jpg';
            }
        })
        res.render('./users/profile', {user, trades, sender, receiver});
    })
    .catch(err=>next(err));
};

exports.logout = (req, res, next)=>{
    
    req.session.destroy(err=>{
        if(err) 
           return next(err);
        else {
            res.redirect('/');  
        }
    });
   
 };
