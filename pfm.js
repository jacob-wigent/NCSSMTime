const d = new Date();
let day = d.getDay();
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
dow = daysOfWeek[day];

if (dow != "Saturday" && dow != "Sunday")
    document.getElementById("pfm-mf").innerHTML = `PFM HOURS:<br>Breakfast: 7:45 AM to 10:00 AM<br>Lunch: 11:30 AM to 1:30 PM<br>Dinner: 5:00 PM to 7:30 PM`;

if (dow == "Saturday" || dow == "Sunday")
    document.getElementById("pfm-ss").innerHTML = `PFM HOURS:<br>Brunch: 10:30 AM to 1:00 PM<br>Dinner: 5:00 PM to 6:30 PM`;