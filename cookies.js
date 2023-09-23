// set cookie with checkbox state
function setCheckboxStateInCookie() {
    const morganton = document.getElementById("mor");
    document.cookie = `morCheckboxState=${morganton.checked}; path=/`;
}

// retrieve checkbox state from cookie
function getCheckboxStateFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'morCheckboxState') {
            return value === 'true'; // convert string to boolean
        }
    }
    return false; // false if no cookies :(
}

// initialize checkbox state based on cookie when page loads
window.addEventListener('load', () => {
    const morganton = document.getElementById("mor");
    morganton.checked = getCheckboxStateFromCookie();
});

// update when ticked
document.getElementById("mor").addEventListener("change", setCheckboxStateInCookie);