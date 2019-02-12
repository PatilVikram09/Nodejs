console.log("Node.js");

var Employee = {
        EmpNo:101,
        EmpName:"Abs"
};
console.log(JSON.stringify(Employee));

add(3,7);
function add(x,y){
    var res = parseInt(x)+parseInt(y);
    console.log(res);
}