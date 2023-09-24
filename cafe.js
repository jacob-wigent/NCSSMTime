function updateCafeHours() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dow = daysOfWeek[(new Date()).getDay()];
    
    let morganton = document.getElementById("mor").checked;
    
    if (morganton) {
        if (dow != "Saturday" && dow != "Sunday")
            document.getElementById("cafe-mf").innerHTML = `DINING HALL HOURS:<br>Breakfast: 7:00 AM to 9:30 AM<br>Lunch: 11:00 AM to 1:00 PM<br>Dinner: 5:00 PM to 7:00 PM`;
    
        if (dow == "Saturday" || dow == "Sunday")
            document.getElementById("cafe-ss").innerHTML = `DINING HALL HOURS:<br>Brunch: 10:30 AM to 1:00 PM<br>Dinner: 5:00 PM to 7:00 PM`;
    }
    
    else {
        if (dow != "Saturday" && dow != "Sunday")
            document.getElementById("cafe-mf").innerHTML = `PFM HOURS:<br>Breakfast: 7:45 AM to 10:00 AM<br>Lunch: 11:30 AM to 1:30 PM<br>Dinner: 5:00 PM to 7:30 PM`;
    
        if (dow == "Saturday" || dow == "Sunday")
            document.getElementById("cafe-ss").innerHTML = `PFM HOURS:<br>Brunch: 10:30 AM to 1:00 PM<br>Dinner: 5:00 PM to 6:30 PM`;
    }    
}

// call function during page load
window.addEventListener('load', () => {
    const morganton = document.getElementById("mor");
    morganton.checked = getCheckboxStateFromCookie();
    updateCafeHours();
});

// update when ticked
document.getElementById("mor").addEventListener("change", updateCafeHours);
