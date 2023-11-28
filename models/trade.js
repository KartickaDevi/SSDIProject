const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
        category: {type: String, required:[true, 'title is required']},
        make:{type: String, required:[true, 'title is required']},
        model:{type: String, required:[true, 'title is required']},
        year:{type: String, required:[true, 'title is required']},
        trim:{type: String, required:[true, 'title is required']},
        mileage:{type: String, required:[true, 'title is required']},
        myProfile : {type: Schema.Types.ObjectId, ref:'User'},
        statusPending: {type: Boolean},
        status: {type: String},
        /*image:'/image/civic.jpg'*/
        reviews: [{
            user: {type: Schema.Types.ObjectId,ref: "User"},
            name: {type: String},
            review: {type: String}
        }]
},
{timestamps: true}
);

//collection name is stories in the database
module.exports  = mongoose.model('Trade', tradeSchema);




/*const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');
const suvimage = '/image/camry.png';
const sedanimage = '/image/civic.jpg';
const luximage = '/image/Cars.jpg';

const trades = [
    {
        id:'1',
        "category": "Sedan","make":"Honda-Accord",        "model":"x1",        "year":"2023",        "trim":"16",        "mileage":"20",        image:'/image/civic.jpg'    },
    {
        id:'2',
        category: 'Sedan',
        make:'Toyota-Camry',
        model:'x1',
        year:'2023',
        trim:'16',
        mileage:'20',
        image:'/image/civic.jpg'
    },
    {
        id:'3',
        category: 'Sedan',
        make:'Honda-Civic',
        model:'x1',
        year:'2023',
        trim:'16',
        mileage:'20',
        image:'/image/civic.jpg'
    },
    {
        id:'4',
        category: 'SUV',
        make:'Highlander',
        model:'x1',
        year:'2023',
        trim:'16',
        mileage:'20',
        image:'/image/civic.jpg'
    },
    {
        id:'5',
        category: 'SUV',
        make:'Audi Q7',
        model:'x1',
        year:'2023',
        trim:'16',
        mileage:'20',
        image:'/image/camry.png'
    },
    {
        id:'6',
        category: 'SUV',
        make:'SUV',
        model:'x1',
        year:'2023',
        trim:'16',
        mileage:'20',
        image:'/image/camry.png'
    },
    
]
 

exports.find = () => trades;

exports.findById = (id) => trades.find(trade=>trade.id === id);

exports.save = function (trade) {
    trade.id = uuidv4();
    if(trade.category === 'Sedan'){
        trade.image = sedanimage;
    }else if(trade.category === 'SUV'){
        trade.image = suvimage;
    }else if(trade.category === 'Luxury'){
        trade.image = luximage;
    }
    trades.push(trade);
}

exports.updateById = function(id, newTrade) {
    let index = trades.findIndex(trade => trade.id === id);
    console.log("checkhere " + id + " " + index);

    let trade = trades.find(trade=>trade.id === id);
    
    if(trade) {
        trade.id = newTrade.id;
        trade.category = newTrade.category;
        trade.make = newTrade.make;
        trade.model = newTrade.model;
        trade.year = newTrade.year;
        trade.trim = newTrade.trim;
        trade.mileage = newTrade.mileage;
        if(trade.category === 'Sedan'){
            trade.image = sedanimage;
        }else if(trade.category === 'SUV'){
            trade.image = suvimage;
        }else {
            trade.image = luximage;
        }
        console.log("checkhere " + id + " " + index);
        return true;
    }else{
        return false;
    }
}

exports.deleteById = function(id) {

    let index = trades.findIndex(trade => trade.id === id);
    console.log("checkhere " + id + " " + index);
    if(index !== -1) {
        trades.splice(index, 1);
        return true;
    }else{
        return false;
    }
}*/
