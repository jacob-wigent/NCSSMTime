let pageTitle = "";
let scheduleMap = new Map();

let mod = true;
setInterval(() => updateSchedule(), 200); // calls update every 200 ms

function updateSchedule() {
    // getting the date
    let currentTime = new Date();

    // force refresh at 12:00:00 AM in case of special updates
    if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0 && currentTime.getSeconds() === 0 && currentTime.getMilliseconds() <= 400)
        location.reload();

    // calculating time difference
    let nextEvent = getNextEvent(currentTime);
    let timeDifference = nextEvent.date - currentTime;
    timeDifference = Math.floor(timeDifference / 1000);
    let seconds = timeDifference % 60;
    timeDifference = Math.floor(timeDifference / 60);
    let minutes = timeDifference % 60;
    timeDifference = Math.floor(timeDifference / 60);
    let hours = timeDifference;

    // formatting the actual countdown string
    let timeString = `${(hours === 0 ? "" : hours.toString() + ":")}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // fancy subtext below the main one for lab blocks if people don't have a lab but do have the main block (example A2 but NOT A2 Lab)
    let labMinutes = 0;
    let labHours = 0;
    
    let timeString2 = "";
    let eventStr = nextEvent.name.toString();
    if ((hours * 60 + minutes) - 40 >= 0 && eventStr.substring(eventStr.length - 3) === "Lab" && !mod) { // if lab block comes after main block
        labMinutes = minutes - 40;
        labHours = hours;
        if (labMinutes < 0 && labHours >= 1) {
            labMinutes += 60;
            labHours -= 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerText = `${timeString2} left of ${eventStr.substring(3,5)} ONLY`;
    }
    else if (eventStr.includes("Lunch") && !mod) { // countdown during lunch for after lunch lab
        labMinutes = minutes + 40;
        
        if (labMinutes >= 60) {
            labMinutes -= 60;
            labHours += 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (dayOfWeek(currentTime.getDay()) === "Tuesday")
            document.getElementById("txt2").innerText = `${timeString2} left of Lunch for G2 ONLY`;

        if (dayOfWeek(currentTime.getDay()) === "Wednesday")
            document.getElementById("txt2").innerText = `${timeString2} left of Lunch for E3 ONLY`;

        if (dayOfWeek(currentTime.getDay()) === "Thursday")
            document.getElementById("txt2").innerText = `${timeString2} left of Lunch for F4 ONLY`;
    }
    else if ((hours * 60 + minutes) - 50 >= 0 && eventStr.substring(6, 9) === "Lab" && !mod) { // if lab block comes before main block (only after lunch)
        labMinutes = minutes - 50;
        labHours = hours;
        
        if (labMinutes < 0 && labHours >= 1) {
            labMinutes += 60;
            labHours -= 1;
        }

        timeString2 = `${(labHours === 0 ? "" : labHours.toString() + ":")}${labMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerText = `${timeString2} left of Lunch for ${eventStr.substring(3,5)} ONLY`;
    }
    else if (eventStr.includes("before H") || eventStr.includes("of H") || eventStr.includes("Transition (H") || eventStr.includes("of I")) { // before check timer (completely separate)
        let hrsBeforeCheck = 0;
        let minBeforeCheck = 0;

        if (eventStr.includes("before H")) {
            hrsBeforeCheck = hours + 3;
            minBeforeCheck = minutes + 45;
        }
        else if (eventStr.includes("of H")) {
            hrsBeforeCheck = hours + 2;
            minBeforeCheck = minutes + 5;
        }
        else if (eventStr.includes("of Transition (H")) {
            hrsBeforeCheck = hours + 1;
            minBeforeCheck = minutes + 55;
        }
        else {
            hrsBeforeCheck = hours;
            minBeforeCheck = minutes + 15;
        }

        if (minBeforeCheck >= 60) {
            minBeforeCheck -= 60;
            hrsBeforeCheck += 1;
        }

        timeString2 = `${(hrsBeforeCheck === 0 ? "" : hrsBeforeCheck.toString() + ":")}${minBeforeCheck.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById("txt2").innerText = `${timeString2} left before Check`;
    }
    else if (mod) {
        document.getElementById("txt2").innerText = "";
    }
    else { // turn off the text
        document.getElementById("txt2").innerText = "";
    }

    document.getElementById("txt").innerText = `${timeString} left ${nextEvent.name}`; // countdown text that replaces "Loading..."
    
    if (pageTitle !== timeString) { // tab timer
        if (eventStr.includes("Transition")) {
            document.title = `${timeString} *TRANSITION*`;
            pageTitle = `${timeString} *TRANSITION*`;
        }
        else if (eventStr.includes("of Check")) {
            document.title = `${timeString} *CHECK*`;
            pageTitle = `${timeString} *CHECK*`;
        }
        else {
            document.title = timeString;
            pageTitle = timeString;
        }
    }
}

function getNextEvent(dateTime) { // finds the next event
    let currentTime = dateTime === undefined ? new Date() : dateTime;

    updateTimeMap(currentTime);

    let day = dayOfWeek(currentTime.getDay());
    if (document.getElementById("banner").innerText != `Today is ${day}` && !mod) // updating the day of week banner on the top of main page
        document.getElementById("banner").innerText = `Today is ${day}`;

    let events;
    if (mod) { // override
        events = scheduleMap.get("Modified");
        document.getElementById("banner").innerText = `Have a great fall break!`;
    }
    else {
        events = scheduleMap.get(day);
    }

    return events.find(event => event.date > currentTime);
}

function dayOfWeek(number) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[number];
}

function updateTimeMap(currentTime) { // the actual code
    let year = currentTime.getFullYear();
    let month = currentTime.getMonth();
    let day = currentTime.getDate();
    scheduleMap.set("Modified", [{
            date: new Date(year, 9, 8, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, 9, 8, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, 9, 9, 8, 30),
            name: "before B3"
        }
    ]);
    scheduleMap.set("Monday", [{
            date: new Date(year, month, day, 8, 30),
            name: "before A1"
        },
        {
            date: new Date(year, month, day, 9, 20),
            name: "of A1"
        },
        {
            date: new Date(year, month, day, 9, 25),
            name: "of Transition (A1 to B1)"
        },
        {
            date: new Date(year, month, day, 10, 15),
            name: "of B1"
        },
        {
            date: new Date(year, month, day, 10, 20),
            name: "of Transition (B1 to C1)"
        },
        {
            date: new Date(year, month, day, 11, 10),
            name: "of C1"
        },
        {
            date: new Date(year, month, day, 11, 15),
            name: "of Transition (C1 to D1)"
        },
        {
            date: new Date(year, month, day, 12, 5),
            name: "of D1"
        },
        {
            date: new Date(year, month, day, 12, 55),
            name: "of Lunch"
        },
        {
            date: new Date(year, month, day, 13, 45),
            name: "of E1"
        },
        {
            date: new Date(year, month, day, 13, 50),
            name: "of Transition (E1 to F1)"
        },
        {
            date: new Date(year, month, day, 14, 40),
            name: "of F1"
        },
        {
            date: new Date(year, month, day, 14, 45),
            name: "of Transition (F1 to G1)"
        },
        {
            date: new Date(year, month, day, 15, 35),
            name: "of G1"
        },
        {
            date: new Date(year, month, day, 15, 40),
            name: "of Transition (G1 to Meeting)"
        },
        {
            date: new Date(year, month, day, 17, 0),
            name: "of Meeting"
        },
        {
            date: new Date(year, month, day, 18, 15),
            name: "before H1"
        },
        {
            date: new Date(year, month, day, 19, 55),
            name: "of H1"
        },
        {
            date: new Date(year, month, day, 20, 5),
            name: "of Transition (H1 to I1)"
        },
        {
            date: new Date(year, month, day, 21, 45),
            name: "of I1"
        },
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 8, 30),
            name: "before D2"
        }
    ]);
    scheduleMap.set("Tuesday", [{
            date: new Date(year, month, day, 8, 30),
            name: "before D2"
        },
        {
            date: new Date(year, month, day, 9, 20),
            name: "of D2"
        },
        {
            date: new Date(year, month, day, 9, 25),
            name: "of Transition (D2 to E2)"
        },
        {
            date: new Date(year, month, day, 10, 15),
            name: "of E2"
        },
        {
            date: new Date(year, month, day, 10, 20),
            name: "of Transition (E2 to A2)"
        },
        {
            date: new Date(year, month, day, 11, 50),
            name: "of A2 AND A2 Lab"
        },
        {
            date: new Date(year, month, day, 12, 40),
            name: "of Lunch"
        },
        {
            date: new Date(year, month, day, 14, 10),
            name: "of G2 Lab AND G2"
        },
        {
            date: new Date(year, month, day, 14, 15),
            name: "of Transition (G2 to F2)"
        },
        {
            date: new Date(year, month, day, 15, 5),
            name: "of F2"
        },
        {
            date: new Date(year, month, day, 16, 0),
            name: "of Flexible Use Time"
        },
        {
            date: new Date(year, month, day, 18, 15),
            name: "before H2"
        },
        {
            date: new Date(year, month, day, 19, 55),
            name: "of H2"
        },
        {
            date: new Date(year, month, day, 20, 5),
            name: "of Transition (H2 to I2)"
        },
        {
            date: new Date(year, month, day, 21, 45),
            name: "of I2"
        },
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 8, 30),
            name: "before B3"
        }
    ]);
    scheduleMap.set("Wednesday", [{
            date: new Date(year, month, day, 8, 30),
            name: "before B3"
        },
        {
            date: new Date(year, month, day, 9, 20),
            name: "of B3"
        },
        {
            date: new Date(year, month, day, 9, 25),
            name: "of Transition (B3 to D3)"
        },
        {
            date: new Date(year, month, day, 10, 15),
            name: "of D3"
        },
        {
            date: new Date(year, month, day, 10, 20),
            name: "of Transition (D3 to C3)"
        },
        {
            date: new Date(year, month, day, 11, 50),
            name: "of C3 AND C3 Lab"
        },
        {
            date: new Date(year, month, day, 12, 40),
            name: "of Lunch"
        },
        {
            date: new Date(year, month, day, 14, 10),
            name: "of E3 Lab AND E3"
        },
        {
            date: new Date(year, month, day, 14, 15),
            name: "of Transition (E3 to F3)"
        },
        {
            date: new Date(year, month, day, 15, 5),
            name: "of F3"
        },
        {
            date: new Date(year, month, day, 15, 10),
            name: "of Transition (F3 to G3)"
        },
        {
            date: new Date(year, month, day, 16, 0),
            name: "of G3"
        },
        {
            date: new Date(year, month, day, 18, 15),
            name: "before H3"
        },
        {
            date: new Date(year, month, day, 19, 55),
            name: "of H3"
        },
        {
            date: new Date(year, month, day, 20, 5),
            name: "of Transition (H3 to I3)"
        },
        {
            date: new Date(year, month, day, 21, 45),
            name: "of I3"
        },
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 8, 30),
            name: "before C4"
        }
    ]);
    scheduleMap.set("Thursday", [{
            date: new Date(year, month, day, 8, 30),
            name: "before C4"
        },
        {
            date: new Date(year, month, day, 9, 20),
            name: "of C4"
        },
        {
            date: new Date(year, month, day, 9, 25),
            name: "of Transition (C4 to A4)"
        },
        {
            date: new Date(year, month, day, 10, 15),
            name: "of A4"
        },
        {
            date: new Date(year, month, day, 10, 20),
            name: "of Transition (A4 to B4)"
        },
        {
            date: new Date(year, month, day, 11, 50),
            name: "of B4 AND B4 Lab"
        },
        {
            date: new Date(year, month, day, 12, 40),
            name: "of Lunch"
        },
        {
            date: new Date(year, month, day, 14, 10),
            name: "of F4 Lab AND F4"
        },
        {
            date: new Date(year, month, day, 14, 15),
            name: "of Transition (F4 to G4)"
        },
        {
            date: new Date(year, month, day, 15, 5),
            name: "of G4"
        },
        {
            date: new Date(year, month, day, 16, 0),
            name: "of Flexible Use Time"
        },
        {
            date: new Date(year, month, day, 18, 15),
            name: "before H4"
        },
        {
            date: new Date(year, month, day, 19, 55),
            name: "of H4"
        },
        {
            date: new Date(year, month, day, 20, 5),
            name: "of Transition (H4 to I4)"
        },
        {
            date: new Date(year, month, day, 21, 45),
            name: "of I4"
        },
        {
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 8, 30),
            name: "before A5"
        }
    ]);
    scheduleMap.set("Friday", [{
            date: new Date(year, month, day, 8, 30),
            name: "before A5"
        },
        {
            date: new Date(year, month, day, 9, 20),
            name: "of A5"
        },
        {
            date: new Date(year, month, day, 9, 25),
            name: "of Transition (A5 to C5)"
        },
        {
            date: new Date(year, month, day, 10, 15),
            name: "of C5"
        },
        {
            date: new Date(year, month, day, 10, 20),
            name: "of Transition (C5 to D5)"
        },
        {
            date: new Date(year, month, day, 11, 50),
            name: "of D5 AND D5 Lab"
        },
        {
            date: new Date(year, month, day, 12, 40),
            name: "of Lunch"
        },
        {
            date: new Date(year, month, day, 13, 30),
            name: "of B5"
        },
        {
            date: new Date(year, month, day, 13, 35),
            name: "of Transition (B5 to E5)"
        },
        {
            date: new Date(year, month, day, 15, 5),
            name: "of E5 AND E5 Lab"
        },
        {
            date: new Date(year, month, day, 16, 0),
            name: "of Flexible Use Time"
        },
        {
            date: new Date(year, month, day, 23, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 23, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 23, 0),
            name: "before Check"
        }
    ]);
    scheduleMap.set("Saturday", [{
            date: new Date(year, month, day, 23, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 23, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 22, 0),
            name: "before Check"
        }
    ]);
    scheduleMap.set("Sunday", [{
            date: new Date(year, month, day, 22, 0),
            name: "before Check"
        },
        {
            date: new Date(year, month, day, 22, 5),
            name: "of Check"
        },
        {
            date: new Date(year, month, day + 1, 8, 30),
            name: "before A1"
        }
    ]);
}

function formatTime(dateTime) { // technical formatting stuff
    let hours = (dateTime.getHours()) % 12;
    if (hours === 0) {
        hours = 12;
    }
    return hours.toString().padStart(2, '0') + ":" + dateTime.getMinutes().toString().padStart(2, '0');
}

function isAtBottom(element) {
    return element.scrollTop - (element.scrollHeight - element.clientHeight) > -1;
}
