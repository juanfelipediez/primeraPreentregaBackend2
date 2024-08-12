import { Router } from "express";
import { productModel } from "../models/product.model.js"
import { cartModel } from "../models/carts.model.js"


const viewsRouter = Router()

//Muestra los productos disponibles y da la posibilidad de agregarlos al carrito

viewsRouter.get('/:cid', async (req, res) => {
    try{
        const { cid } = req.params
        const{page = 1, limit = 10, category = '', sort = 'asc', pid} = req.query
        let categoryQuery
        let selectedCategory
        category ?  categoryQuery = {category: category} :  categoryQuery = {}
        category ?  selectedCategory = category :  selectedCategory = ''
        const products = await productModel.paginate(categoryQuery, {limit: limit, page: page, sort: {price: sort}})
        

        const {docs, prevPage, nextPage, hasPrevPage, hasNextPage} = products
        let prevLink
        let nextLink
        hasPrevPage ? prevLink = `http://localhost:5000/${cid}/?limit=${limit}&page=${prevPage}&sort=${sort}&category=${selectedCategory}` : prevLink = null
        hasNextPage ? nextLink = `http://localhost:5000/${cid}/?limit=${limit}&page=${nextPage}&sort=${sort}&category=${selectedCategory}` : nextLink = null
        const currentLink = `http://localhost:5000/${cid}/?limit=${limit}&page=${page}&sort=${sort}&category=${selectedCategory}`
        const result = {
            status: 200,
            payload: docs,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            currentLink: currentLink,
            nextLink: nextLink,
        }

        if(pid){
            const cart = await cartModel.findById(cid)
            const product = await productModel.findById(pid)
            if (!cart || !product) {
                return console.log(`Cart or product not found`);
            }
            const alreadyIncludedProduct = cart.includedProducts.find((el) => el.product.toString() === pid)
            if(alreadyIncludedProduct){
                alreadyIncludedProduct.quantity++
                console.log(`One item of the product (${product.title}) was added to the cart`)
            }else{
                cart.includedProducts.push({product: pid, quantity: 1})
                console.log(`The product ${product.title} was added to the cart`)
            }
            await cartModel.findByIdAndUpdate(cid, {
                $set: {
                    includedProducts: cart.includedProducts
                }
            })
        }

        res.render('addToTheCart', { result, cid })
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Muestra los productos disponibles
viewsRouter.get('/', async (req, res) => {
    try{
        const{page = 1, limit = 10, category = '', sort = 'asc'} = req.query
        let categoryQuery
        let selectedCategory
        category ?  categoryQuery = {category: category} :  categoryQuery = {}
        category ?  selectedCategory = category :  selectedCategory = ''
        const products = await productModel.paginate(categoryQuery, {limit: limit, page: page, sort: {price: sort}})//.sort({price: 'asc'})
        

        const {docs, prevPage, nextPage, hasPrevPage, hasNextPage} = products
        let prevLink
        let nextLink
        hasPrevPage ? prevLink = `http://localhost:5000/?limit=${limit}&page=${prevPage}&sort=${sort}&category=${selectedCategory}` : prevLink = null
        hasNextPage ? nextLink = `http://localhost:5000/?limit=${limit}&page=${nextPage}&sort=${sort}&category=${selectedCategory}` : nextLink = null
        const result = {
            status: 200,
            payload: docs,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        }

        res.render('addToTheCart', { result })
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Muestra los productos en el carrito y da la posibilidad de eliminarlos
viewsRouter.get("/carts/:cid", async (req, res) => {
    try{
        const { cid } = req.params
        const { pid } = req.query
            let cart = await cartModel.findById(cid).populate('includedProducts.product')
    
            if(!cart){
                res.status(400).json(`The cart with number ID ${cid} doesn't exist`)
                return
            }

            if(pid){
                const product = await productModel.findById(pid)
                const cart = await cartModel.findById(cid)
        
                const includedProduct = cart.includedProducts.find((el) => el.product == pid)
                console.log(includedProduct)
                if(includedProduct){
                    cart.includedProducts.splice(cart.includedProducts.indexOf(includedProduct), 1)
                    console.log(`The product ${product.title} has been deleted.`)
                    await cartModel.findByIdAndUpdate(cid, {
                        $set: {includedProducts: cart.includedProducts}
                    })
                }
            }
            cart = await cartModel.findById(cid).populate('includedProducts.product')
            return res.status(200).render('cartView', {cart})
    
        }catch(error){
            res.status(500).json(`Error: ${error}`)
        }
    })

    
export default viewsRouter