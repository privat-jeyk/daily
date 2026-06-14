/* GET THE DATE */
var date = new Date();
// console.log(date);

/* EXTRACT THE CURRENT DATE INFO */
var currentMonth = date.getMonth();
var currentDay = date.getDay();
var currentDate = date.getDate();
var currentYear = date.getFullYear();

console.log(currentMonth); // current month - 1
console.log(currentDay); // day of the week
console.log(currentDate); // current date/number
console.log(currentYear); // current year
