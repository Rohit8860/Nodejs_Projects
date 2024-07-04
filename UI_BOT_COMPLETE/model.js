import { Schema,model } from "mongoose";

const log_blog = new Schema({
    username : String,
    password: String
})

export const user_log = model('user_log',log_blog)
// const 


const blogSchema = new Schema({
    event_name: String,
    event_id: String,
    event_url: String,
    login:String,
    no_of_tickets:String,
    price: String,
    active:String
});


export const Blog = model('Blog', blogSchema);



