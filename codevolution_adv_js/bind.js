globalThis.x=69;
const obj={
    x:42,
    getX:function(){
        return this.x;
    },
    getXArrow:()=>{
        return this.x;
    }
}
console.log(obj.getX()); //42
console.log(obj.getXArrow()); //undefined

const getX=obj.getX;

console.log(getX()); //undefined

const boundGetX=getX.bind(obj);
console.log(boundGetX()); //42