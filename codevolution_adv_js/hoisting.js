// console.log(a);
// let a=10;
// function hoisting
sayHello(); // Hello
function sayHello(){
    console.log("Hello");
}

sayHello2(); // TypeError: sayHello2 is not a function
var sayHello2=function(){
    console.log("Hello");
}
// in case of var, the variable is hoisted but not the value. So, sayHello2 is undefined at the time of calling. Hence, it throws TypeError: sayHello2 is not a function. In case of function declaration, both the function name and its body are hoisted. Hence, it works fine.