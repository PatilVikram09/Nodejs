var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var cors = require("cors");
var jwt = require("jsonwebtoken");

mongoose.Promise = global.Promise;

var instance = express();

var router = express.Router();

instance.use(router);
instance.use(bodyparser.urlencoded({extended:false}));
instance.use(bodyparser.json());
instance.use(cors());

mongoose.connect(
    "mongodb://localhost/ProductAppDb",
    {useNewUrlParser:true}
);
var dbConnect = mongoose.connection;
if(!dbConnect){
    console.log("Connection is not established");
    return;
}


var userSchema = mongoose.Schema({
    userName:String,
    password:String
})

var userModel = mongoose.model("User", userSchema,"User");

instance.get("/api/users/check/:username", function(request, response){

    var username = request.params.username;
    //console.log(username);

    userModel.find({userName:username}).exec(function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });

});

instance.post("/api/users/create", function(request, response){
    var usr = {
        userName:request.body.userName,
        password:request.body.password,
    };

    userModel.create(usr, function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, Message:"User Created Successfully"});
    });
});

var jwtSetting = {
    jwtSecret:"vikrampatl09harbingergroup07"
};

instance.set("jwtSecret", jwtSetting.jwtSecret);
var tokenStore = "";


instance.post("/api/users/auth", function(request, response){
    var user = {
        userName:request.body.userName,
        password:request.body.password,
    };

    userModel.findOne({userName:request.body.userName}, function(error, usr){

        if(error){
            respose.status = 500;
            response.send({status:respose.status, error:error});
        }

        if(!usr){
            response.send({status:404, Message:"Sorry user not avaliable"});
        }
        else if(usr){
            //console.log("User : "+JSON.stringify(user))
            if(usr.password != user.password){
                response.send({status:404, Message:"Sorry username and passowrd does not match"});
            }
            else{

                var token = jwt.sign({usr}, instance.get("jwtSecret"),{
                    expiresIn:3600
                });

                tokenStore = token;
                //console.log(token)
                response.send({authenticated:true,Message:"Login Success",token:token});
            }
        }
    });
});

var productsSchema = mongoose.Schema({
    ProductId:Number,
    ProductName:String,
    CategoryName:String,
    Manufacturer:String,
    Price:Number
});

var productModel = mongoose.model("Products", productsSchema,"Products");

instance.get("/api/products",function(request, response){

    var receivedToken = request.headers.authorization.split(" ")[1];
    //console.log(receivedToken)

    jwt.verify(receivedToken, instance.get("jwtSecret"), function(error, decoded){

        if(error){
            response.send({success:false, Message:"Token verification failed"});
        }
        else{
            request.decoded = decoded;
           
            productModel.find().exec(function(err,res){
                if(err){
                    respose.status = 500;
                    response.send({status:respose.status, error:err});
                }
                response.send({status:200, data:res});
            });
        
        }

    });
    
});


instance.post("/api/products", function(request, response){

    var receivedToken = request.headers.authorization.split(" ")[1];

    jwt.verify(receivedToken, instance.get("jwtSecret"), function(error, decoded){

        if(error){
            response.send({success:false, Message:"Token verification failed"});
        }
        else{

            request.decoded = decoded;
           
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
                response.send({status:200, Message:"Product Added Successfully"});
            });
        
        }

    });
});


instance.put("/api/products/:id", function(request, response){

    var receivedToken = request.headers.authorization.split(" ")[1];

    jwt.verify(receivedToken, instance.get("jwtSecret"), function(error, decoded){

        if(error){
            response.send({success:false, Message:"Token verification failed"});
        }
        else{

            request.decoded = decoded;
           
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
                response.send({status:200,Message:"Product Updated Successfully"});
            });
        
        }

    });

});


instance.delete("/api/products/:id", function(request, response){
    
    var receivedToken = request.headers.authorization.split(" ")[1];

    jwt.verify(receivedToken, instance.get("jwtSecret"), function(error, decoded){

        if(error){
            response.send({success:false, Message:"Token verification failed"});
        }
        else{

            request.decoded = decoded;
           
            var condition = {
                ProductId: request.params.id
            }
           productModel.deleteOne(condition, function(err,res){
                if(err){
                    respose.status = 500;
                    response.send({status:respose.status, error:err});
                }
                response.send({status:200,Message:"Product Deleted Successfully"});
           });
        
        }

    });
 });


instance.listen(4070, function(){
    console.log("Started listing on port 4070")
});