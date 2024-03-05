import express from "express";
import mongoose from "mongoose";
import { Blog } from "./model.js";
import path from "path";
var app = express()
const __dirname = path.resolve()



mongoose.connect(
    "mongodb://localhost:27017/", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);



app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(__dirname+'/style'))


app.get("/addblog",async(req,res)=>{
    console.log('Gettting request------->')
    res.render('addBlog')
})

app.post("/addBlog",async(req,res)=>{
    console.log("requesting------->")
    console.log(req.body)
    const data = await Blog.create(req.body)
    data.save()
    res.render('addBlog')
})

app.get("/", async(req,res)=>{
    console.log('send data----->')
    const data1 = await Blog.find({})
    res.render('index',{blogs:data1})
})

app.listen(3000,()=>{
    console.log('project run on localhost:3000')
})