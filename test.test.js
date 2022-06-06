let str = "Mon chien \n et moi \n sommes pote \n et on s'aime bien";

let arr = str.split('\n').filter(e=> e.trim()).join('-')

console.log(arr);