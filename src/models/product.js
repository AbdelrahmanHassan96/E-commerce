const mongoose = require('mongoose')

const ProdectSchema = new mongoose.Schema({
    prodect_title:{
        type:String,
        trim:true,
        required:true,
    },
    prodect_description:{
        type:String,
        trim:true
    },
    prodect_colories:[
        {
            color:{
                type:String,
                trim:true
            }
        }
    ],
    prodect_quantity:{
        type:Number,
        required:true   
    },
    prodect_details:{
        type:String,
    },
    prodect_price:{
        type:Number,
        required:true
    },
    prodect_category:{
        type:String,
        trim:true,
        required:true
    },
    prodect_prand:{
        type:String,
        trim:true,
    },
    prodect_discount:{
        type:Number,
        default:0,
    },
    prodect_picture:[
        {
            picture:{
                type:String
            }
        }
    ],
    prodect_active:{
        type:Boolean,
        required:true,
        default:true
    },
    prodect_date:{
        type:Date,
        required:true,
        default:Date.now()
    },
    prodect_sizes:[
        {
            size:{
                type:String,
            }
        }
    ],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},
{ timestamps: true }
)

ProdectSchema.virtual('Card',{
    ref:'Card', localField:'_id', foreignField:'products.product'
})


const Prodect = mongoose.model('Prodect', ProdectSchema)
module.exports = Prodect
