const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema ({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    products: [{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Product'
        }
        ,
        quantity:{
            type:Number,
            required:true,
            default:1,
            trim:true
        }
    }
    ],
    total_price:{
        type:Number,
        default:0
    },
    status:{
        type: String,
        required: true,
        default: 'Pending',
    },
    dateOrdered:{
        type: Date,
        default: Date.now,
    },
})


CardSchema.virtual('Orders',{
    ref:'Orders', localField:'_id', foreignField:'card_id'
})

// CardSchema.statics.CalcTotal = async function(){
//     const card = this 
//     card.prodects.forEach(element => {
//         card.total_price = prodects.quantity * prodects.price
//     });
//     await card.save()
// }

// CardSchema.methods.CalcTotal = async function(prodect){
//     const card = this
//     card.total_price = 
//     await card.save()
//     return total
// }




const Card = mongoose.model('Card', CardSchema)
module.exports = Card