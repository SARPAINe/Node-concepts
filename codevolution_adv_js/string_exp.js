const text=new String("Hello");
console.log(text); // [String: 'Hello']
console.log(typeof text); // object
console.log(text instanceof String); // true
console.log(text instanceof Object); // true
console.log(text.valueOf()); // Hello
console.log(text.toString()); // Hello
console.log(text.charAt(1)); // e
// when we create a string using new keyword, it creates a string object. This is because, in JavaScript, strings are primitive data types. When we create a string using new keyword, it creates a string object which has some additional properties and methods. Hence, it is not a primitive data type anymore.