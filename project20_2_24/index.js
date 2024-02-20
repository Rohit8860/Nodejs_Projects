// var express = require("express")
import express from "express"
import mongoose from "mongoose";

import { Blog } from "./module.js";
import path from "path"

const __dirname = path.resolve();

var app = express()
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
// app.set("views", path.join(__dirname, "views"));


mongoose.connect(
  "mongodb://localhost:27017/", 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);






app.get("/addBlog",async (req,res)=>{
  console.log("getting....")
  // res.send(blog)
  res.render("addBlog")
})


app.post("/addblog",async (req,res)=>{
  console.log("requesting........")
  console.log(req.body)
  const data = await Blog.create(req.body)
  data.save()
  res.render("addblog")
})

app.get("/profile",async (req,res)=>{
  const data = {
  }

  const data1 = await Blog.find({})

  res.render("index",{blogs:data1})

})




app.listen(3000,()=>{
    console.log("project is run on localhost:3000")
})