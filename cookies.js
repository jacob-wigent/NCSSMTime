// Function to set cookie with checkbox state
function setCheckboxStateInCookie(checkboxId, cookieName) {
    const checkbox = document.getElementById(checkboxId);
    document.cookie = `${cookieName}=${checkbox.checked}; path=/`;
}

// Function to retrieve checkbox state from cookie
function getCheckboxStateFromCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value === 'true'; // convert string to boolean
        }
    }
    return false; // false if no cookie found
}

// Function to initialize checkbox state based on cookie when page loads
function initializeCheckboxState(checkboxId, cookieName) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = getCheckboxStateFromCookie(cookieName);
}

// Add event listeners to update cookie when checkbox state changes
function addCheckboxEventListeners(checkboxId, cookieName) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.addEventListener("change", () => setCheckboxStateInCookie(checkboxId, cookieName));
}

// Initialize checkbox states and add event listeners on page load
window.addEventListener('load', () => {
    initializeCheckboxState("mor", "morCheckboxState");
    initializeCheckboxState("enable-short", "enableShortState");

    addCheckboxEventListeners("mor", "morCheckboxState");
    addCheckboxEventListeners("enable-short", "enableShortState");

    // Apply background based on the "mor" checkbox state
    const isMorganton = getCheckboxStateFromCookie("morCheckboxState");
    if (isMorganton) {
        document.body.classList.add('morganton');
    } else {
        document.body.classList.remove('morganton');
    }
});
