const MONTHLY_INPUT = 20000000;

// let AMOUNT = MONTHLY_INPUT;

// let AMOUNT = 3000000000;

// const ANUAL_INPUT = 960000000;
// const ANUAL_INPUT = 240000000; 240tr
const ANUAL_INPUT = 240000000;

// let AMOUNT = ANUAL_INPUT;
let AMOUNT = ANUAL_INPUT + ANUAL_INPUT * 0.1;

for (let i = 2; i <= 15; i++) {
    AMOUNT = AMOUNT + AMOUNT * 0.1 + ANUAL_INPUT;
}

/*
240 tr + 24 tr = 264 tr
240 tr + 264 tr + 26 tr = 530 tr
240 tr + 530 tr + 53 tr = 823 tr
240 tr + 823 tr + 82 tr = 1145
240 tr + 1145 + 114.5 tr = 1499.5
240 tr + 1499.5 + 149 tr = 1888.5
240 tr + 1888.5 + 188 tr = 2316.5
240 tr + 2316.5 + 231.5 tr = 2788
240 tr + 2788 + 278.5 tr = 3306.5
240 tr + 3306.5 + 330.5 tr = 3876
*/

// 3,3 tỷ
console.log('================= AMOUNT ', AMOUNT);
