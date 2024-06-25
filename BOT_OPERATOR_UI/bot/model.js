import { Schema,model } from "mongoose";

const ticket_data = new Schema({
    section:String,
    row:String,
    seat:String,
    cookie:String
})

export const Ticket = model('Ticket',ticket_data)