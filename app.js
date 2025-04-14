const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const createError = require("http-errors");
const redis_url = 6379;
const client = redis.createClient(redis_url);
// another two ways
// const client = redis.createClient(redis_url,"redis://127.0.0.1")
// const client = redis.createClient({port:6379,host:`redis://127.0.0.1`})

const app = express(); 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// first way of connecting to mongodb
// from mongoose connect method just pass simple
// string or atlas cloud string anyway you can connect without these callbacks
 
mongoose.connect("mongodb://localhost:27017/Poorna_Mongodb_api")
.then(()=>console.log(`Mongodb is connected`))
.catch(e=>console.log(e.message))

// second way to connect to mongodb
// mongoose.connect("mongodb://localhost:27017/Poorna_Mongodb_api",()=>console.log(`Mongodb is connected`),e=>{console.error(e)});


client.on('error', (err) => {
    next(createError(500,err.message))
  });

async function start_redis_connection(){
    await client.connect();
    console.log("connected to redis server");
}


start_redis_connection()
module.exports = client 

app.get("/",cache,async (req,res,next)=>{
    console.log(client);
    try{
        r= await client.get("poorna");
    
    }catch(e){
        console.error(e.message);
    }
    res.send(r);
})

// cache middleware
function cache(req,res,next){
    console.log("connected to cache");
    next()
}



const UserRouter = require("./Routes/User.route");

app.use("/users",UserRouter);


// 404 handler and pass to error handler 
app.use((req,res,next)=>{
    // 1st way of achieving 404 error is using built in error package ( new Error() ) 

    // const error = new Error("Not Found");
    // error.status = 404 ;
    // next(error);


    // 2nd way of achieving 404 error is using  (http-errors) package 

    next(createError(404,"Not Found")); 
   
})


// error handler 
app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.send({error:{status:err.status||500,message:err.message}})
})


app.listen(3000,()=>{console.log(`server running at port 3000`)});


mongoose.connection.on("disconnected",()=>{
    console.log("Mongoose connection is disconnected...")
})



// Graceful shutdown
process.on('SIGINT', async () => {
    try {
      console.log('\nGracefully shutting down...');
  
      // Close MongoDB connection
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed.');
  
      // Quit Redis connection
      await redisClient.quit();
      console.log('✅ Redis connection closed.');
  
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  