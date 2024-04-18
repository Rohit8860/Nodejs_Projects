import { Router } from "express";
import { Blog } from "../model.js";

const route = Router()


route.get("/allPost",async (req,res)=>{
    const blogs = await Blog.find()
    res.json({"data":blogs})
})

route.post("/add",async (req,res)=>{
    // const body = res.body
    console.log(req.body)
    const data = await Blog.create(req.body)
    data.save()
    res.json({
        "status":"sucess",
        data:data
    })
    // res.json({"data":"add page"})
})

export default route