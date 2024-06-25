import express from "express"
var app = express()
import mongoose from "mongoose"
import { Blog } from "./model.js";
import path from "path"
import route from "./api/index.js";
import cors from "cors"
import { spawn } from "child_process";
import { Ticket } from "./bot/model.js";
import methodOverride from "method-override";


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
app.use(methodOverride('_method'));

app.get("/",async (req,res)=>{
  const data1 = await Blog.find({})
  console.log(data1)
  res.render("index",{blogs:data1})

})


app.delete('/tickets/:id', async (req, res) => {
    try {
      await Ticket.findByIdAndDelete(req.params.id);
      res.redirect('/tickets');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/tickets', async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.render('tickets.ejs', { tickets });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).send('Internal Server Error');
    }
  });


app.get('/start-bot',async(req,res)=>{
    try{
        const data = await Blog.find();
        const scrapperProcess = spawn('node',['bot/scrapper.js',JSON.stringify(data)]);
        scrapperProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        // scrapperProcess.stderr.on('data', (data) => {
        //     console.error(`stderr: ${data}`);
        // });
        // scrapperProcess.on('close', (code) => {
        //     console.log(`Scrapper process exited with code ${code}`);
        //     // Send success response to the client
        //     res.sendStatus(200);
        // });
    }catch (err) {
        console.error('Error starting bot:', err);
        // Send error response to the client
        res.status(500).send('Error starting bot')}
})


app.get("/rohit",async(req,res)=>{
  res.render('my')
})

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

    // data.title = req.body.title
    // data.body = req.body.body
    // data.dateandtime = req.body.dateandtime
    // data.user  = req.body.user

    data.event_name = req.body.event_name
    data.event_id = req.body.event_id
    data.event_url = req.body.event_url
    data.login = req.body.login
    data.no_of_tickets = req.body.no_of_tickets
    data.price = req.body.price

    data.save()
    res.redirect(`/blog/${req.params.id}`)
})


app.post("/addblog",async (req,res)=>{
    console.log("requesting........")
    console.log(req.body)
    const data = await Blog.create(req.body)
    data.save()
    res.render("addBlog",{type:"add"})
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