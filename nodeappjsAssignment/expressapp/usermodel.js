var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var instance = express();


var router = express.Router();
instance.use(router);
instance.use(bodyparser.urlencoded({extended:false}));
instance.use(bodyparser.json())

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
    userId:String,
    password:String
})

var userModel = mongoose.model("User", userSchema,"User");

instance.get("/api/user",function(request, response){
    userModel.find().exec(function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
    
});

instance.post("/api/user", function(request, response){
    var usr = {
        userId:request.body.userId,
        password:request.body.password,
    };

    userModel.create(usr, function(err,res){
        if(err){
            respose.status = 500;
            response.send({status:respose.status, error:err});
        }
        response.send({status:200, data:res});
    });
});

module.exports ={
    checkuser:function(userId, password,response){
        var query = { userId: userId, password: password };
        userModel.findOne(query).exec(function(err, res){
                if(err){
                    console.log(err)
                }
                else{
                    if(res){
                       return response(true)
                    }
                    else{
                        return response(false)
                    }
                }
           });
          
    }
}
