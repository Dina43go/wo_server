// const bcrypt = require('bcrypt')

// const hash = bcrypt.hash('123456789',10, (err, hash)=>{
//     console.log(hash);
// })


let duold = new Date('2022-05-30T11:57:36.000Z').getDate()
let du5 = new Date('2022-05-05').getDate()
let duNow = new Date().getDate()

console.log(duold);
console.log(du5);
console.log(duNow);

// 7-5 = 1 on moment
// 7-5 > 1 on date
// 7-30 < 0 on date
let arr = [1,2,3,4,5];

if([1,2,3,4,5].includes((7-2))){
    console.log('on date');
}

// if((duNow - du5) == 1) {
//     console.log('moment');
// } else if((duNow - du5) > 1) {
//     console.log('on date');
// }