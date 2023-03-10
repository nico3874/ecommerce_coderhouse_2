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












/* Crear un modelo Ticket el cual contará con todas las formalizaciones de la compra. Éste contará con los campos
Id (autogenerado por mongo)
code: String debe autogenerarse y ser único
purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
amount: Number, total de la compra.
purchaser: String, contendrá el correo del usuario asociado al carrito.
 */