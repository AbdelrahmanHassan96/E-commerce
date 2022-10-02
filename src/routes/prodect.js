const express = require('express')
const Prodect = require('../models/product')
const auth = require('../middleware/author')
const router = new express.Router()
//add prodect
router.post('/prodect/Add', auth , async (req ,res)=>{
    const prodect  = new Prodect({
        ...req.body,
        seller:req.data._id        
    })
    try{
        await prodect.save()
        res.status(200).send({
            status:1,
            data:prodect,
            msg:'scceuss'
        })
    }
    catch(e){
        res.status(400).send({
            status:0,
            data:e,
            msg:'prodect error'
        })
    }
})
//get all prodects
router.get('/prodect/All',auth,async(req,res)=>{
    try{
        const prodects = await Prodect.find({})
        res.status(200).send({
            status:1,
            data:prodects,
            msg:'sccess'
        })
    }
    catch(e){
        res.status(400).send({
            status:0,
            data:e,
            msg:'error in get all prodect'
        })
    }
})
//edit prodect
router.patch('/prodect/Edit/:id',auth,async (req,res)=>{
    const _id= req.params.id
    const updates = req.body
    try{
        const prodect = await Prodect.findByIdAndUpdate(_id, updates,{
            new:true,
            runValidators:true
        })
        if(!prodect){
            res.status(200).send({
                status:2,
                data:"",
                msg:"prodect not found"
            })
        }
        res.status(200).send({
            status:1,
            data: prodect, 
            msg:"prodect data retreived successfuly"
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
//delete prodect
router.delete('/prodect/Delete/:id', auth ,async(req,res)=>{
    const _id= req.params.id
    try{
        const prodect = await Prodect.findByIdAndDelete(_id)
        if(!prodect){
            res.status(200).send({
                status:2,
                data:"",
                msg:"prodect not found"
            })
        }
        res.status(200).send({
            status:1,
            data: prodect, 
            msg:"prodect data deleted successfuly"
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
//get single prodect
router.get('/prodect/:id',auth , async (req,res)=>{
    const _id = req.params.id
    try{
        const prodect = await Prodect.findById(_id)
        if(!prodect){
            res.status(200).send({
                status:2,
                data:"",
                msg:"there no prodect"
            })
        }
        res.status(200).send({
            status:1,
            data:prodect,
            msg:"sccess"
        })
    }
    catch(e){
        res.status(500).send({
            status:0,
            data:"",
            msg:"error"
        })
    }
})


module.exports = router