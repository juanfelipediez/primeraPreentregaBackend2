import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        unique: true,
    },    
    code: {
        type: String, 
        required: true,
        unique: true,
    },    
    description: String,    
    price: {
        type: Number, 
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: String,
    },    
});


productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model('Product', productSchema); 
