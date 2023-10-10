const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  sender: {type: Schema.Types.ObjectId, ref:'User'},
  receiver: {type: Schema.Types.ObjectId, ref:'User'},
  sender_car: {type: Schema.Types.ObjectId, ref:'Trade'},
  receiver_car: {type: Schema.Types.ObjectId, ref:'Trade'},
  status: {type: String,  required:[true, 'status is required']},
  /*image:'/image/civic.jpg'*/
},
  { timestamps: true }
);

//collection name is stories in the database
module.exports = mongoose.model('Offer', offerSchema);