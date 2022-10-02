/*
 register ->done , login ->done , get profile ->done , edit profile ->done ,delete user ->done alluser done
 */
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/author')
const router = new express.Router()

//register
router.post('/register',async (req,res)=>{
    const data =new User(req.body)
    try{
        await data.save()
        const token = await data.generateToken()
        res.status(200).send({
            status:1,
            data:data,
            msg:'user register succ',
            token:token
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            data:e,
            msg:'error in data',
            token:""
        })
    }
})

//get profile
router.get('/profile', auth , async(req,res)=>{
    console.log('profile')
    try{
        console.log('profile')
        res.statue(200).send({
            data: req.data,
            status:1
        })
    }
    catch(e){
        res.status(500).end({
            data:'',
            status:0
        })
    }
})

//edit user profile
router.patch('/editPofile/:id', auth ,async(req,res)=>{
    const _id= req.params.id
    const updates = req.body
    const updatesKeys = Object.keys(req.body)
    const allowedUpdates = ["user_name","user_password","user_image","user_phone"]
    const validUpdates = updatesKeys.every((u)=>allowedUpdates.includes(u))
    if(!validUpdates)
        res.status(400).send({
            status:3,
            data:'',
            msg:'invalid updates'
        })
    try{
        const user = await User.findByIdAndUpdate(_id, updates,{
            new:true,
            runValidators:true
        })
        if(!user){
            res.status(200).send({
                status:2,
                data:"",
                msg:"user not found"
            })
        }
        res.status(200).send({
            status:1,
            data: user, 
            msg:"user data retreived successfuly"
        })
    }
    catch(e){
        res.status(500).send({
            statue: 0,
            data:'',
            msg:"error edit data"
        })
    }
})

// delete user by id 
router.delete('/user/:id', auth ,async(req,res)=>{
    const _id= req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            res.status(200).send({
                status:2,
                data:"",
                msg:"user not found"
            })
        }
        res.status(200).send({
            status:1,
            data: user, 
            msg:"user data deleted successfuly"
        })
    }
    catch(e){
        res.status(500).send({
            statue: 0,
            data:'',
            msg:"error delete data"
        })
    }
})

//user login 
router.post('/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({
            status:1,
            data:user,
            msg:"logged in",
            token: token
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            data:"",
            msg:"err in data",
            token:""
        })
    }
})

//get all users
router.get('/allUsers', auth , async (req,res)=>{
    try{
        role =await req.data.user_role
        if (!role==2) throw new Error('not admin')
        const users = await User.find({})
        res.status(200).send({
            status:1,
            data: users,
            msg: 'all users selected',
            me: req.data
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            data: e,
            msg: 'error loading users data'
        })
    }
})

module.exports = router