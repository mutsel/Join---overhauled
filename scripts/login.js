let userMailIndex = [];
let userPasswordIndex = [];

/**
 * This function is the inital function, when login.html is loading and executes the init()-function and furher necessary login-functions
 */
async function initLogIn() {
    await init();
    loggedInUser = "";
    clearLogInForm();
    currentUser = -1;
}

/**
 * This function clears the input-values of the login-form 
 */
function clearLogInForm() {
    userMail = "";
    userPassword = "";
}

/**
 * This function reads out the mail and password and if they are filled in correctly and fit to a user, the user is able to log in
 */
async function logIn() {
    const userMail = document.getElementById("mail").value;
    const userPassword = document.getElementById("password").value;
    if (userMail !== "" && userPassword !== "") {
        loggedInUser = checkUserDataExists();
        if (loggedInUser !== -1) {
            await putData("/currentUser/userId", loggedInUser);
            redirectionToSummary()
        } else {
            logInRequirementsUnfullfilled();
        }
    } else {
        logInRequirementsUnfullfilled();
    }
}

/**
 * This function redirects the user to the summary (Login succesfull)
 */
function redirectionToSummary() {
    window.location.href = "./html/summary.html";
}

/**
 * This function checks which login-requirements are unfullfilled and gives the user feedback accordingly (alerts and marked inputs)
 */
function logInRequirementsUnfullfilled() {
    document.getElementById("alertLogIn").classList.remove("invisible");
    document.getElementById("mail").classList.add("requirement-unfulfilled");
    document.getElementById("password").classList.add("requirement-unfulfilled");
    setTimeout(function () {
        document.getElementById("alertLogIn").classList.add("invisible");
        document.getElementById("mail").classList.remove("requirement-unfulfilled");
        document.getElementById("password").classList.remove("requirement-unfulfilled");
    }, 2400);
}

/**
 * This function executes functions that fill the two defined arrays with the index of each user, who uses the given input.
 * Then, mail and password are going to be compared.
 */
function checkUserDataExists() {
    checkUserMailExists();
    checkUserPasswordExists();
    return compareMailPassword();
}

/**
 * This function fills the userMailIndex-Array with each index of a user, whom mail fits the mail-input
 */
function checkUserMailExists() {
    const userMail = document.getElementById("mail").value;
    userMailIndex = [];
    for (let indexUser = 0; indexUser < users.length - 1; indexUser++) {
        let mail = users[indexUser].mail;
        if (mail === userMail) {
            userMailIndex.push(indexUser)
        }
    }
}

/**
 * This function fills the userPasswordIndex-Array with each index of a user, whom password fits the passowrd-input
 */
function checkUserPasswordExists() {
    const userPassword = document.getElementById("password").value;
    userPasswordIndex = [];
    for (let indexUser = 0; indexUser < users.length - 1; indexUser++) {
        let password = users[indexUser].password;
        if (password === userPassword) {
            userPasswordIndex.push(indexUser)
        }
    }
}

/**
 * This function is part of the checkUserDataExists()-function and checks, if a user exists, who has the given mailaddress and the given password assigned
 */
function compareMailPassword() {
    for (let i = 0; i < userMailIndex.length; i++) {
        for (let j = 0; j < userPasswordIndex.length; j++) {
            if (userMailIndex[i] == userPasswordIndex[j]) {
                return userMailIndex[i];
            }
        }
    }
    return -1
}

/**
 * This function gives the currentUser the id of the guest, so the users doesn't need to sign up to use Join
 * 
 * @param {number} loggedInUser - the id of the logged in user
 */
async function guestLogin() {
    loggedInUser = users.length - 1;
    await putData("/currentUser/userId", loggedInUser);
    redirectionToSummary(loggedInUser);
}