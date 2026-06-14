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

// IMPORTANT DATE INFO
var months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
];

// SET THE CORRECT MONTH
var title = document.getElementById("title");
title.innerHTML = "🌸" + months[currentMonth] + "🌸";

// UPDATE THE CALENDAR INFO

var habitTitle = document.getElementById("habitTitle");
habitTitle.onclick = function () {

    let habits = prompt("Wie ist deine Routine heute", habitTitle.innerHTML);
    if(habits.length == 0 ) {
        habitTitle.innerHTML = "Klicken um die Routine festzulegen";
    } else {
        habitTitle.innerHTML = habits;
    }
}