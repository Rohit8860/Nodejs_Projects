import { Schema,model } from "mongoose";

const ticket_data = new Schema({
    eventName:String,
    section:String,
    row:String,
    seat:String,
    price:String,
    cookie:String
})

export const Ticket = model('Ticket',ticket_data)