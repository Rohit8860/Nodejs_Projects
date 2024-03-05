import { Schema,model } from "mongoose";


const blogSchema = new Schema({
    title:String,
    body:String,
    user:String,
    date:String
}
)


export const Blog = model('Blog',blogSchema);