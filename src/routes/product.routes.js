import { Router } from "express"
import { productModel } from "../models/product.model.js"


const router = Router()

//Obtener json con todos los productos
router.get("/", async (req, res) => {
    try{        
        const products = await productModel.find()
        if(products.length < 1){
            res.status(200).json("There are no products yet")
            return
        }
        res.status(200).json(products)

    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Obtener un producto por el id
router.get("/:pid", async (req, res) => {
    try{        
        const { pid } = req.params
        const product = await productModel.find({_id: pid})

        if(!product){
            res.status(400).json(`The ID ${pid} doesn't exist.`)
            return
        }
        res.status(200).json(product)
    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Crear nuevo producto
router.post("/", async(req, res) => {
    const {title, description, code, price, status, stock, category, thumbnails} = req.body

    if(!title || !description || !code || !price || !stock || !category || !status){
        res.status(400).json("All this properties are required: title, description, code, price, status, stock, category")
        return
    }

    const newProduct = {
        title: title,
        code: code,
        description: description,
        price: price,
        status: status,
        stock: stock,
        category: category,
        thumbnails: thumbnails,
    }
    const product = await productModel.create(newProduct)
    
    res.status(201).json(`The product ${title} was successfully created.`)
})

//Editar producto
router.put('/:pid', async (req, res) => {
    try{
        const {title, description, code, price, status, stock, category, thumbnails} = req.body
        const { pid } = req.params

        if(!pid){
            res.status(400).json(`The ID ${pid} doesn't exist.`)
            return
        }

        const product = await productModel.findByIdAndUpdate(pid, { 
            $set: {
                code: code,
                title: title,
                description: description,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnails: thumbnails,        
            }
        })

    res.status(200).json(`The product ${title} was successfully edited.`)

    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})

//Eliminar producto
router.delete('/:pid', async (req, res) => {
    try{
        const { pid } = req.params

        if(!pid){
            res.status(400).json(`The ID ${pid} doesn't exist.`)
            return
        }

        const product = await productModel.findById(pid)
        const productTitle = product.title
        await productModel.findByIdAndDelete(pid)

    res.status(200).json(`The product ${productTitle} was successfully deleted.`)

    }catch(error){
        res.status(500).json(`Error: ${error}`)
    }
})


export default router
