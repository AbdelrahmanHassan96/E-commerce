const mongoose = require('mongoose')

const OrdersSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    card_id:{
        type : mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Card'
    }
},{timestamps:true})

const Orders = mongoose.model('Orders', OrdersSchema)
module.exports = Orders
