// let a = 10;
// function outer() {
//   let b = 20;
//   function inner() {
//     let c = 30;
//     console.log(c); // 30
//     console.log(b); // 20
//     console.log(a); // 10
//   }
//   inner();
//   // console.log(c); // ReferenceError: c is not defined
// }
// outer();

let global_a = 30;
function outer(c, d) {
  let block_a = 20;
  function inner() {
    global_a = global_a + c;
    block_a = block_a + d;
    console.log(global_a, block_a); // 40 30
  }
  return inner;
}

const increment5and6 = outer(5, 6);
increment5and6();
increment5and6();
const increment4and3 = outer(4, 3);
increment4and3();
increment4and3();
increment4and3();
increment5and6();
