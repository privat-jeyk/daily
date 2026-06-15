/* GET THE DATE */
var date = new Date();

/* EXTRACT THE CURRENT DATE INFO */
var currentMonth = date.getMonth();
var currentDay = date.getDay();
var currentDate = date.getDate();
var currentYear = date.getFullYear();

// console.log(currentMonth); // current month - 1
// console.log(currentDay); // day of the week
// console.log(currentDate); // current date/number
// console.log(currentYear); // current year

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

// SET THE TOTAL DAYS
var daysInTheMonthList = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var daysInThisMonth = daysInTheMonthList[currentMonth];

var daysCompleted = 0;
var totalDays = document.getElementById("totalDays");

// SETUP THE CALENDAR DAYS
var dayCount = 0;
var rowCount = 0;
var days = document.getElementsByClassName("days");

for(var i=0; i < days.length; i++ ){
    var day = days[rowCount].getElementsByClassName("day");
    for ( var j=0; j < day.length; j++){
        if(dayCount == currentDate -1){
            day[j].setAttribute("style","color:var(--side2)");
            day[j].setAttribute("style","border:2px solid var(--text)");
        }
    }
}