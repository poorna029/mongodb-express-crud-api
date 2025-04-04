// express http server method 
const express = require("express");

const app = express(); 

// unlike http module for catching a route we require one if statement 
// for catching http method another if statement

// if any route is not found express handles it unlike http module way so
// i am not showing other route here you can try it on your own

app.get("/" , (req,res,next)=>{ 
    res.send({url:req.url,method: req.method})
})

app.post("/" , (req,res,next)=>{
    res.send({url:req.url,method: req.method})  
})

app.delete("/" , (req,res,next)=>{
    res.send({url:req.url,method: req.method})
})

app.put("/" , (req,res,next)=>{
    res.send({url:req.url,method: req.method})
})

app.patch("/" , (req,res,next)=>{
    res.send({url:req.url,method: req.method})
})

app.listen(3000,()=>{console.log(`server running at portn 3000`)});
