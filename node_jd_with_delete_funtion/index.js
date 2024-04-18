import express from "express"
var app = express()
import mongoose from "mongoose"
import { Blog } from "./model.js";
import path from "path"
import route from "./api/index.js";
import cors from "cors"
const __dirname = path.resolve();

mongoose.connect(
    "mongodb://localhost:27017/", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors())
app.use(express.urlencoded());
app.use(express.static(__dirname + '/style'));
app.use("/api",route)
app.get("/addBlog",async (req,res)=>{

    console.log("getting....")
    // res.send(blog)
    res.render("addBlog",{type:"add"})
})

app.get("/edit/:id",async (req,res)=>{
    console.log(req.params.id)
    const data = await Blog.findById(req.params.id)
    console.log(data)
    res.render("addBlog",{data:data,"type":"edit"})
})

app.post("/edit/:id",async (req,res)=>{
    // console.log(req.params.id)
    // console.log(req.body)

    // const data = await Blog.updateOne({id:req.params.id},{
    //     title:req.body.title,
    //     body:req.body.body,
    //     dateandtime:req.body.dateandtime,
    //     user:req.body.user        
    // })
    const data = await Blog.findById(req.params.id)

    data.title = req.body.title
    data.body = req.body.body
    data.dateandtime = req.body.dateandtime
    data.user  = req.body.user

    data.save()
    // console.log(data)
    // data.acknowledged

    // const data = await Blog.findById(req.params.id)
    // console.log(data)
    res.redirect(`/blog/${req.params.id}`)
    // res.render("addBlog",{data:data,"type":"edit"})
})


app.post("/addblog",async (req,res)=>{
    console.log("requesting........")
    console.log(req.body)
    const data = await Blog.create(req.body)
    data.save()
    res.render("addBlog",{type:"add"})
})


app.get("/",async (req,res)=>{

    const data1 = await Blog.find({})
    res.render("index",{blogs:data1})

})


app.get("/blog/:id",async (req,res)=>{
    let blog_id = req.params.id
    const res_ = await Blog.findById(blog_id)
    // res.send(`<h1>${res_}</h1>`)
    res.render("detail",{blog:res_})
})

app.delete("/blog/:id", async(req,res)=>{
  let id = req.params.id
  const res_ = await Blog.findByIdAndDelete(id)
  if (res_ !== -1){
    
  }
})


app.listen(3000,()=>{
    console.log("project is run on localhost:3000")
})