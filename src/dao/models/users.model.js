import mongoose from "mongoose";


const usersCollection = 'users'

const usersSchema = mongoose.Schema({
    name:String,
    lastName:String,
    age:Number,
    email:{
        type:String,
        unique:true
    },
    password:String,
    role:{
        type:String,
        default:'user'
    },
    cartId:{
        
        type:mongoose.Schema.Types.ObjectId,
        ref:'carts',
        
        
    },
    
    
})

usersSchema.pre('find', function(){
    this.populate('carts')
})

const usersModel = mongoose.model(usersCollection, usersSchema)

export default usersModel