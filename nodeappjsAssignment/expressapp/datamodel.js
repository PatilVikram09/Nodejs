var Products = [
    {id:101, name:"P1"},
    {id:102, name:"P2"},
    {id:103, name:"P3"},
    {id:104, name:"P4"}
];

module.exports = {
    getData:function(){
        return Products;
    },

    addData:function(prd){
        Products.push(prd);
        return Products;
    },

    deleteData:function(id){
        for(var i=0; i<Products.length; i++){
           if(Products[i].id==id){
                Products.splice(i,1);
                break;
           }
        }
        return Products;
    },

    putData:function(prd,id){
        for(var i=0; i<Products.length; i++){
            if(Products[i].id==id){
                 Products[i] = prd;
                 break;
            }
         }
         return Products;
    }

};