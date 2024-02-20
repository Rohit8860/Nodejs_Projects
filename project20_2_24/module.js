import { Schema,model } from "mongoose";

const blogSchema = new Schema({
  Email:String,
  Password:String,
  Firstname:String,
  Lastname:String,
  DateofBirth:String,
});


export const Blog = model('Blog', blogSchema);


// export default Blog = model('Student', blogSchema);