//1. load express
var express = require("express");
//1.a load the path module. this will be used btstatic middleware of express

var path = require("path");

//1.b import the data model
var datamodel = require("./datamodel");

var usrmodel = require("./usermodel");

//1.c load body-parser
var bodyparser = require("body-parser");




//1.d loading mongoose driver
var mongoose = require("mongoose");

//1.e set the golbal promise to manage all sync calls made by application using mongoose driver
mongoose.Promise = global.Promise;

//2. define an instance of express
var instance = express();

//3.configure all middleware, call "use()" method on express instance
    //3.a static files
    instance.use(
        express.static(
            path.join(__dirname,"./../node_modules/jquery/dist/")
            )
    );

    //3.b define express router for seggrigating
    // urls for html page web requests and rest api requests
    var router = express.Router();
    //3.c and the router object in the express middleware
    instance.use(router);

    //3.d configure the body-parser middleware
    //3.d1 use ulrencoded as false to read data from http url as querystring formmodel etc
    instance.use(bodyparser.urlencoded({extended:false}));

    //3.d2 use the json() paeser for body-parser
    instance.use(bodyparser.json())

//4.create web request handelers
//4.a this will return home.html from views folder

    router.get("/home",function(req,res){
        res.sendFile("home.html",{
            root:path.join(__dirname,"./../views")
        });
    });


//5. Model-schema-Mapping with collection on mongoDB ansd establishing collection with it..
mongoose.connect(
    "mongodb://localhost/ProductAppDb",
    {useNewUrlParser:true}
);

//5.a create the connnection object
//if dbconnect is not undefined then connection is successful
var dbConnect = mongoose.connection;
if(!dbConnect){
    console.log("Connection is not established");
    return;
}

//5.b define schema(recommended to have same attributes as per the collection)
var productsSchema = mongoose.Schema({
    ProductId:Number,
    ProductName:String,
    CategoryName:String,
    manufacturer:String,
    Price:Number
});

//5.c map the schema with the collection
//                                    name        schema     collection
var productModel = mongoose.model("Products", productsSchema,"Products");






//6. create rest api  request handler
/*instance.get("/api/products",function(request, response){
    //6.a make call to DB for a collection mapped with model and expect all document from it.
        productModel.find().exec(function(err,res){
        if(err){
           // 6.b if error occured the respond error
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
    
});*/

instance.post("/api/products", function(request, response){
    var prd = {
        ProductId:request.body.ProductId,
        ProductName:request.body.ProductName,
        CategoryName:request.body.CategoryName,
        Manufacturer:request.body.Manufacturer,
        Price:request.body.Price,
    };

    productModel.create(prd, function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
});

instance.get("/api/products", function(request, response){

    var authValues = request.headers.authorization;
    var credentials = authValues.split(" ")[1];
    var data = credentials.split(":");
    var username = data[0];
    var password = data[1];
    //console.log(username);
    //console.log(password);

    usrmodel.checkuser(username,password, function(res){
        //console.log(res)
        if(res==true){
           // console.log("yes")

           productModel.find().exec(function(err,data){
                if(err){
                    respose.status = 500;
                    response.send({status:respose.status, error:err});
                }
                response.send({status:200, data:data});
            });
           
        }else{
            response.send({status:401, message:"Unathorised access"});
        }
    })
    


    
});

instance.put("/api/products/:id", function(request, response){
   
    
});

instance.delete("/api/products/:id", function(request, response){
   
});


//6.start listener

instance.listen(4070, function(){
    console.log("Started listing on port 4070")
});