// why we are not using inbuilt http module
//  is it is difficult to maintain let's compare it with express server 


const http = require("http");

const server = http.createServer((req , res)=>{
    // any route/path will hit this callback function which very confusing to maintain all the code...


    // if you want to handle routes we need to catch with if statements like this below 

    if (req.url==="/")  
    {
        // if it is get method also we have to use if block , 
        // so it is tedious task to manage every method on every route

        if(req.method="GET"){
            console.log("get request");
        }else if(req.method ="POST"){
            console.log("post request");
        }else if(req.method ="PUT"){
            console.log("put request");
        }else if(req.method="PATCH"){
            console.log("patch request");
        }else if(req.method="DELETE"){
            console.log("delete request");
        }else{
            console.log("invalid request");
        }

        res.write(" you are on home route...");
        res.end();
    }
    else if (req.url==="/other") 
    {
        switch (req.method) {
            case "GET":
                console.log("get req");
                break;
            case "POST":
                console.log("post req");
                break;
            case "PATCH":
                console.log("patch req");
                break;
            case "PUT":
                console.log("put req");
                break;
            case "DELETE":
                console.log("delete req");
                break;
        
            default:
                console.log("invalid req method");
                break;
        }
        res.write(" you are on other route ...");
        res.end();
    }
    else 
    {
        res.write(" you are on anonymous route ...");
        res.end();
    }
})

server.listen(3000,()=>console.log(`server is running on port 3000 ...`));
// so , this way either we have to use if blocks or switch cases to handle different methods on different routes 


