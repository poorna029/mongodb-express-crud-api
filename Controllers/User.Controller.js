const mongoose = require("mongoose");
const createError = require("http-errors");
const redis_client = require("../app");
const userModel = require("../Models/User.model");

// checking document whether it existed or not and returning it with req argument 
async function is_found(req,res,next){
    const {id} = req.params ;
    let is_user_found ;
    try{
        // mongodb id validation 
        if(!mongoose.Types.ObjectId.isValid(id)){
           return res.status(400).send("Send Valid MongodbID");

        }
        // is_cached? 
        if(!(is_user_found=redis_check(id))){;
            req.details= is_user_found;
            next()
           

        }else{
            is_user_found = await userModel.findById(id);
            if(is_user_found){
                
                redis_save(id,is_user_found);
                req.details= is_user_found;
                next()
                
            }else{
               return next(createError(400,"No record Found"))
            }
            
        }
    }
    catch(e){
        return next(createError(400,e.message))
    }

}


// checking in redis db 
async function redis_check(id){
    return await redis_client.get(id)
}

// save in redi db 
async function redis_save(id,doc){
    await redis_client.set(`${id}`,str(doc));
}

function str(a){
    return JSON.stringify(a);
}

function obj(a){
    return JSON.parse(a);
}




module.exports = {
    getAllUsers : async (req,res,next)=>{
        console.log(req.method);

        try{
            let all_users = await redis_client.get("all_users");
            // first check in cached storage if exists send to client else fetch from db // main if else block
            // within main if block , check if any record fetched from mongodb if yes then cache it and send response to the client // else throw error and 
            all_users = obj(all_users)
            // if all_products is not cached all_products will be null 
            let results;
            if(!all_users){
                // fetch from db
                // cache it in redis 
                // send response to client
                results = await userModel.find();
                if(!results){
                    // no records fetched then send error response 
                    
                    next(createError(400,"No record Found"))
                    
                }else{
                    console.log("poorna")
                    await redis_client.set("all_users",str(results));
                    res.send({len:results.length , results});
                }
    
                
            }else{
                // all_products is cached means 
                // then send all_products to client
                res.send({len:all_users.length , all_users});
            }
    
            
        }catch(e){
            console.log(e.message);
            next(createError(404,"error fetching data try again"));
            
        }
    },
    createUser:async (req,res,next)=>{

        const {username,email}=req.body ;
    
        try{
            const is_user_exists_with_username = await userModel.findOne({username});
            const is_user_exists_with_mail = await userModel.findOne({email});
            if(is_user_exists_with_username || is_user_exists_with_mail){
               return res.send("user already exists") ;
            }
            const user = new userModel(req.body) ;
    
    
            // async and await is more cleaner and readable 
            await user.save() ;
            await redis_client.del("all_users")
    
            // below code is in  callback style of writing instead of async and await ,//it also works // check uncommenting 
            // user.save().then((result)=>console.log(result)).catch(e=>console.error(e.message)); olden way of promise handling // just uncomment it , works same as await user.save()
            return res.send(`user created successfully`) ;
    
        }catch(e){
            return next(createError(400,e.message));
            
        }
        
    },
    getUserById:async (req,res,next)=>{
        
        
        try{  
          return  res.send(req.details)
        }
        catch(e){
           return next(createError(400,e.message))
        }
    },
    updateUserById:async (req,res,next)=>{
    
        try{
            const id = req.details.id ;
            const patch_res = await userModel.findByIdAndUpdate(id,req.body,{new:true});
            await redis_save(id,patch_res);
            await redis_client.del("all_users");
           return res.send(patch_res);   
        }
        catch(e){
           return  next(createError(400,e.message));
        }
    },
    deleteUserById: async (req,res,next)=>{
    
        try{
            const id =  req.details.id;
            const response = await userModel.findByIdAndDelete(id);
            await redis_client.del(`${id}`);
            await redis_client.del("all_users");
           return res.send(`${id} deleted successfully`);
            
        }catch(e){
            return next(createError(400,e.message));
        }
    },
    redis_check
    ,
    redis_save
    ,is_found

}