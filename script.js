let age = 17;
const name="Dylan Apfelbeck";
let isStudent = true;

console.log("age:" + typeof age + ", name:" + typeof name + ", isStudent:" + typeof isStudent);

age++;
console.log("New age: " + age);

let canVote = (age >= 18) ? true : false;
console.log("Can vote: " + canVote);


let ageAsString = String(age);
let nameAsNumber = Number(name); // This will result in NaN since the name cannot be converted to a number
let isStudentAsBoolean = Number(isStudent); // This will result in 1 due to binary value 0 being false, and 1 true.

console.log(ageAsString, nameAsNumber, isStudentAsBoolean);


let message = "Age is " + age; 
console.log(message); // implicit conversion from number to string
