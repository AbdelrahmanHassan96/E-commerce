const express = require('express')
const Card = require('../models/card')
const auth = require('../middleware/author')
const Prodect = require('../models/product')
const router = new express.Router()

// add prodect to card
router.post('/card/add/:id/:quantity',auth , async (req,res)=>{
    const product= req.params.id
    let quantity = req.params.quantity
    const user_id = req.data._id
    try {
        let card = await Card.findOne({ user_id });
    
        if (card) {
          //cart exists for user
          let itemIndex = card.products.findIndex(p => p.product == product);
    
          if (itemIndex > -1) {
            //product exists in the cart, update the quantity
            let productItem = card.products[itemIndex];
            productItem.quantity = quantity;
            card.products[itemIndex] = productItem;
          } else {
            //product does not exists in cart, add new item
            card.products.push({ product, quantity});
          }

          await calc (card)
          // console.log(total_price)
          card = await card.save();
          res.status(200).send({
            status:2,
            data:card,
            msg:'scceuss'
          });
        }
      else{
        const card  = new Card({
          ...req.body,
          user_id:req.data._id,
          products:[{product,quantity}]
        })
        calc(card)
        await card.save()
        res.status(200).send({
          status:1,
          data:card,
          msg:'scceuss'
        })
      }
    }
    catch(e){
        res.status(500).send({
            status:0,
            data:e,
            msg:'card error'
        })
    }
})

// get card
router.get('/getCard',auth, async (req,res)=>{
  const user_id = req.data._id
  try {
    const card = await Card.findOne({user_id})
    res.status(200).send({
      status:1,
      data:card,
      msg:'sccuss'
    })
  } catch (e) {
    res.status(500).send({
      status:0,
      data:'',
      msg:'error in load card'
    })
  }
})

//delete item in card
router.post('/card/Delete/:id', auth ,async(req,res)=>{
  const product = req.params.id
  const user_id = req.data._id
  console.log('hi')
  try{

      const card = await Card.findOne({user_id})
      let itemIndex = card.products.findIndex(p => p.product == product);
      card.products[itemIndex].remove()
      console.log(card)
      if(!card){
          res.status(200).send({
              status:2,
              data:"",
              msg:"card not found"
          })
      }
      await card.save()
      res.status(200).send({
          status:1,
          data: card, 
          msg:"card data deleted successfuly"
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
  async function calc(card){
  const items = card.products
  card.total_price = 0
  items.forEach(async element => {
    var _id = element.product
    const product = await Prodect.findById(_id)
    const prodect_price = product.prodect_price
    card.total_price += element.quantity * (prodect_price - prodect_price * product.prodect_discount/100) 
  })
  await card.save()
}

module.exports = router