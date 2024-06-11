import { Schema,model } from "mongoose";

// const 
const blogSchema = new Schema({
    event_name: String,
    event_id: String,
    event_url: String,
    login:String,
    no_of_tickets:String,
    price: String
});


export const Blog = model('Blog', blogSchema);


// export default Blog = model('Student', blogSchema);