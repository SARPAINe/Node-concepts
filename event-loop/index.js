const fs=require('fs');
fs.readFile('./file.txt',(err, data)=>{
    if(err) throw err;  
    console.log(data.toString());
})

setTimeout(()=>{
    console.log('setTimeout');
},0)

setImmediate(()=>{
    console.log('setImmediate');
})

Promise.resolve().then(()=>{
    console.log('promise');
})

process.nextTick(()=>{
    console.log('nextTick');
})

console.log('end');