
var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");

mongoose.Promise = global.Promise;

var instance = express();

instance.use(
    express.static(
        path.join(__dirname,"./../node_modules/jquery/dist/")
        )
);

var router = express.Router();

instance.use(router);
instance.use(bodyparser.urlencoded({extended:false}));
instance.use(bodyparser.json());
instance.use(cors());

router.get("/home",function(req,res){
    res.sendFile("home.html",{
        root:path.join(__dirname,"./../views")
    });
});

mongoose.connect(
    "mongodb://localhost/ProductAppDb",
    {useNewUrlParser:true}
);
var dbConnect = mongoose.connection;
if(!dbConnect){
    console.log("Connection is not established");
    return;
}

var productsSchema = mongoose.Schema({
    ProductId:Number,
    ProductName:String,
    CategoryName:String,
    Manufacturer:String,
    Price:Number
});

//5.c map the schema with the collection
//                                    name        schema     collection
var productModel = mongoose.model("Products", productsSchema,"Products");

//6. create rest api  request handler
instance.get("/api/products",function(request, response){
        productModel.find().exec(function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
    
});

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

instance.put("/api/products/:id", function(request, response){
    var prod = {
        ProductId: request.body.ProductId,
        ProductName: request.body.ProductName,
        CategoryName: request.body.CategoryName,
        Manufacturer: request.body.Manufacturer,
        Price: request.body.Price
    };
    var condition = {
        ProductId: request.params.id
    }
    
    productModel.updateOne(condition, prod, function (err, res) {
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200,data: res});
    });
});

instance.delete("/api/products/:id", function(request, response){
   console.log(request.params.id)
   var condition = {
        ProductId: request.params.id
    }
   productModel.deleteOne(condition, function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200,data: res});
   });
});

instance.get("/api/productsSearch/:value", function(request,response){
   // console.log(request.params.value)
   var categoryName = request.params.value

    productModel.find({CategoryName:{$regex: categoryName ,$options:'i'}}).exec(function(err,res){
        console.log("Resulr : "+res)
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
});


//6.start listener

instance.listen(4070, function(){
    console.log("Started listing on port 4070")
});