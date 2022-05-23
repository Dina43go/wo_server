const colors = require('colors');

let arr2 = [1,2,5,8,7];
let arr = [2,3];

let result = arr.map(u => arr2.includes(u));

console.log(result);
console.log('test::' , 'true'.green.italic.bold);