import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: [
        {product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: Number,

        }
    ]
})

cartSchema.pre('find', function () {
    this.populate('products.product')
})

const cartsModel = mongoose.model(cartCollection, cartSchema)

export default cartsModel