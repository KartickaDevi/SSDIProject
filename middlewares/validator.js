const {body} = require('express-validator');
const {validationResult} = require('express-validator');


exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters, atmost 64 characters').isLength({min:8, max:64})];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be atleast 8 characters, atmost 64 characters').isLength({min:8, max:64})];


exports.validateTrade = [
    body('make','Car Make should be minimum 3 characters').isLength({min:3}).trim().escape(),
    body('model','Car model should be minimum 1 character').isLength({min:3}).trim().escape(),
    body('year','Enter 4 digit year').isLength({min:4, max:4}).isNumeric().trim().escape(),
    body('trim','Enter 2 digit number').isLength({min:2, max:2}).isNumeric().trim().escape(),    
    body('mileage', 'Enter numeric value').isNumeric().trim().escape()
];

/*
exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash('error',err.msg);
        });
        return res.redirect('back');
    }else{
        return next();
    }
};


function getDate(input) {
    var parts = input.split(':');
    var minutes = parts[0]*60 +parts[1];
    var inputDate = new Date(minutes * 60 * 1000);
    return inputDate;
}
*/

