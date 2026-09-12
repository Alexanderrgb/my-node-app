

const fullName = "Судник Александр Николаевич";

const group = "477"; 


const journalNumber = 21; 


function calculatePi(iterations) {
    let pi = 0;
    let sign = 1;
    for (let i = 0; i < iterations; i++) {
        pi += sign / (2 * i + 1);
        sign *= -1;
    }
    return pi * 4;
}


const iterations = 10000000;
const pi = calculatePi(iterations);


console.log(fullName);                       // 1-я строка: ФИО
console.log(group);                          // 2-я строка: группа
console.log(pi.toFixed(journalNumber));      // 3-я строка: число π