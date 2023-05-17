import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = mongoose.Schema({

    code:String,
    detail:[],
    purchase_datetime: String,
    amount: Number,
    purchaser:String
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel












