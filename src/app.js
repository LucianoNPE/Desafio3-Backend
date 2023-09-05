import express from "express"
import cors from "cors"

import { ProductManager} from './persistence/productManager.js'
const productManagerSrervice = new ProductManager('./src/data/products.json')

const port = 8080
const app = express()
app.use(cors())


app.get('/products', async (req, res)=>{
    try {
        const limit = req.query.limit
        const limitNumber = parseInt(limit)
        const products = await productManagerSrervice.getProducts()
        if(limit){
            const productsLimit = products.slice(0, limitNumber)
            res.send(productsLimit)
        }else{
            res.send(products)
        }
    } catch (error) {
        res.send(error.message)
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const products = await productManagerSrervice.getProducts()
        const product = products.find(prod => prod.id === id)
        if(product){
            res.send(product)
        }else{
            res.send(`Producto no encontrado`)
        }
    } catch (error) {
        res.send(error.message)
    }
})


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})
