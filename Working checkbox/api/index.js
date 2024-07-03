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


route.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Find blog by ID and delete it
        const result = await Blog.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({ message: `Blog with ID ${id} deleted successfully.` });
        } else {
            res.status(404).json({ message: `Blog with ID ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog.', error: error });
    }
});

export default route;