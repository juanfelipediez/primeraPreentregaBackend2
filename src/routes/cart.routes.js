import { Router } from "express"
import { cartModel } from "../models/carts.model.js"
import { productModel } from "../models/product.model.js"

const router = Router()

//Crear carrito
router.post("/", async (req, res) => {
    try{
        const cart = await cartModel.create({
            
        })
        res.status(201).json(`A new cart was created.`)
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Mostrar el carrito con todos sus productos
router.get("/:cid", async (req, res) => {
try{
    const { cid } = req.params
        const cart = await cartModel.find({_id: cid}).populate('includedProducts.product')

        if(!cart){
            res.status(400).json(`The cart with number ID ${cid} doesn't exist`)
            return
        }
        
        res.status(200).json(cart)

    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params
        const cart = await cartModel.findById(cid)
        const product = await productModel.findById(pid)
        if (!cart || !product) {
            return res.status(404).json(`Cart or product not found`);
        }
        const alreadyIncludedProduct = cart.includedProducts.find((el) => el.product.toString() === pid)
        if(alreadyIncludedProduct){
            alreadyIncludedProduct.quantity++
            res.status(200).json(`One item of the product (${product.title}) was added to the cart`)
        }else{
            cart.includedProducts.push({product: pid, quantity: 1})
            res.status(200).json(`The product ${product.title} was added to the cart`)
        }
        await cartModel.findByIdAndUpdate(cid, {
            $set: {
                includedProducts: cart.includedProducts
            }
        })
    } catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Cambiar cantidad de un producto en el carrito
router.put("/:cid/product/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params
        const {quantity} = req.body
        const cart = await cartModel.findById(cid)
        const product = await productModel.findById(pid)
        const includedProduct = cart.includedProducts.find( el => el.product == pid)
        includedProduct.quantity = quantity

        await cartModel.findByIdAndUpdate(cid, {
            $set: {
                includedProducts: cart.includedProducts
            }
        })

        res.status(200).json(`The product ${product.title} now has ${quantity} items.`)
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

// Reemplazar array interno del carrito
// Ejemplo del req.body enviado por postman:
//      {
//          "includedProducts": [
//              { "product": "66821d8be7e12918a21ab30b", "quantity": 22 },
//              { "product": "6681e39cfe5467bc0e684f80", "quantity": 44 }
//          ]
//      }
router.put("/:cid", async (req, res) => {
    try {    
        const { cid } = req.params;
        const { includedProducts } = req.body;
        
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json(`El carrito con id ${cid} no existe`);
        }
        await cartModel.findByIdAndUpdate(cid, {
            $set: {
                includedProducts: includedProducts
            }
        })

        res.status(200).json(`The content of this cart was updated.`);
    } catch (error) {
        res.status(500).json(`Error: ${error}`);
    }
});

//Vaciar carrito
router.delete(('/:cid'), async (req, res) => {
    try{
        const {cid} = req.params
        const cart = await cartModel.findById(cid)
        if(!cart){
            return res.status(404).json(`The cart with id ${cid} doesn't exist`)
        }
        await cartModel.findByIdAndUpdate(cid, {
            $set: {
                includedProducts: []
            }
        })

        res.status(200).json(`The cart is now empty.`)
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
}) 

//Eliminar producto del carrito
router.delete('/:cid/product/:pid', async(req, res) => {
    try{
        const {cid} = req.params
        const {pid} = req.params
        const product = await productModel.findById(pid)
        const cart = await cartModel.findById(cid)

        const includedProduct = cart.includedProducts.find((el) => el.product == pid)
        cart.includedProducts.splice(cart.includedProducts.indexOf(includedProduct), 1)
        res.status(200).json(`The product ${product.title} has been deleted.`)
        await cartModel.findByIdAndUpdate(cid, {
            $set: {includedProducts: cart.includedProducts}
        })
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

export default router 


