var http = require('http');

var data = [
    {id:101, name:"A"},
    {id:102, name:"B"},
    {id:103, name:"C"},
    {id:104, name:"D"}
]

//1.create server


var server = http.createServer(function(request,response){
   // response.writeHead(200,{'Content-type':'text/html'});
   // response.write("Hello world!!");


  /* response.writeHead(200,{'Content-type':'application/json'});
   response.write(JSON.stringify(data));
    response.end();*/
});


//2.listen on the prost
server.listen(4050);
console.log("Server started on 4050");