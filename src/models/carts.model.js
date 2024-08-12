import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const cartSchema = new mongoose.Schema({
    includedProducts: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
        default: []
    }
})
cartSchema.plugin(mongoosePaginate)
export const cartModel = mongoose.model("Cart", cartSchema)