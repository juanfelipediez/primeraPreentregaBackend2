import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true,
    },    
    last_name: {
        type: String, 
        required: true,
    },    
    description: String,    
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: String,
        required: true,
    },

// cartId: { type: Schema.Types.ObjectId, ref: "cart"}

    role: {
        type: String,
        required: true,
        default: 'user',
    },    
});


export const userModel = mongoose.model('User', userSchema); 
