// name - username - email - password - status - image - createAt - phone - role - token - birthday - gender

const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required: true,
        trim: true,
        minLength:1,
        maxLength:80
    },
    user_userName:{
        type:String,
        required: true,
        trim: true,
        unique:true,
        minLength:1,
        maxLength:80,
        validate(val){
            if(!validator.isAlphanumeric(val,'en-US')) throw new Error('invalid username')
        }

    },
    user_email:{
        type:String,
        required: true,
        unique: true,
        trim:true,
        minLength:1,
        maxLength:80,
        validate(value){
            if(!validator.isEmail(value)) throw new Error ('invalid email')
        }
    },
    user_password:{
        type:String,
        minLength:6,
        maxLength:100,
        trim:true ,
        required:true
        // validate(value){
        //     //check password strong
        // }
    },
    user_gender:{
        type:Boolean,
        required:true
    },
    user_image:{
        // updata image
    },
    user_phone:{
        type:String,
        minlength:4,
        maxlength:16,
    },
    user_status:{
        type: Boolean, 
        default: true
    },
    birthday:{
            type:Date,  
    },
    user_role:{
        type:Number,
        default:0,
        max:2

    },
    tokens :[
        { 
            token:{ type:String}   
        }
    ]
},
{ timestamps: true }
)
UserSchema.virtual('Prodect',{
    ref:'Prodect', localField:'_id', foreignField:'seller'
})

UserSchema.virtual('Card',{
    ref:'Card', localField:'_id', foreignField:'user_id'
})

UserSchema.virtual('Orders',{
    ref:'Orders', localField:'_id', foreignField:'user_id'
})

UserSchema.methods.toJSON=function(){
    const user = this
    const userOBJ = user.toObject()
    delete userOBJ.user_password
    return userOBJ
}

UserSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('user_password'))
        user.user_password = await bcrypt.hash(user.user_password, 11)
    next()
})
UserSchema.statics.findByCredentials = async function(user_email, user_password){
    const user= await User.findOne({ user_email })
    if(!user) throw new Error('unauthorized')
    const matched = await bcrypt.compare(user_password, user.user_password)
    if(!matched) throw new Error('unauthorized')
    if (!user.user_status) throw new Error('you are blocked please contact with admin')
    return user    
}

UserSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'S[~M?V2WJ:#QNXKK');
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = mongoose.model('User', UserSchema)
module.exports = User

