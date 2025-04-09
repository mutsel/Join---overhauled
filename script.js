const BASE_URL = "https://join-bc94f-default-rtdb.europe-west1.firebasedatabase.app/"

let users = [];
let tasks = [];
let contacts = [];

let currentUser;
let indexContactUser;
let filteredContacts = [];
let filteredTasks = [];
let previousLocation;

const colors = [
  "#ff7a00", // Vivid Orange 
  "#ff5eb3", // Deep Pink 
  "#6e52ff", // Lavender Blue
  "#9327ff", // Violet
  "#00bee8", // Sky Blue
  "#1fd7c1", // Turquoise
  "#ff745e", // Coral
  "#ffa335", // Amber 
  "#fc71ff", // Fuchsia
  "#ffc701", // Golden Yellow
  "#0038ff", // Royal Blue
  "#c3ff2b", // Lime Green
  "#ffe625", // Sun Yellow
  "#ff4646", // Red 
  "#ffbb2b", // Goldenrod 
  "#462f8a"  // Purple
];
let availableColors = [...colors];
let contactColors = {};

/**
 * This function is the global initialisation-function for all pages and executes the loading-screen-function and the fetch-data-function
 */
async function init() {
  await fetchDataJson();
  userIndexInContactsArray();
  if (document.getElementById("header")) {
    headerUser();
  }
  if (window.location.href.includes("help")) {
    hideHelpOption();
  }
  setActiveMenuLink();
}

/**
 * This function fetches the data from the base-URL and transforms it into .json-format
 */
async function fetchDataJson() {
  let joinData = await fetch(BASE_URL + ".json");
  let joinDataJson = await joinData.json();
  filArrays(joinDataJson);
}

/**
 * This function fills the users-, tasks-, and contacts-arrays with the beforehand fetched data
 * 
 * @param {Object} joinDataJson - the fetched object containing the users-, tasks-, and contacts-data
 */
function filArrays(joinDataJson) {
  users = Object.values(joinDataJson.users);
  for (let indexUser = 0; indexUser < users.length; indexUser++) {
    users[indexUser].url = Object.keys(joinDataJson.users)[indexUser];
  }
  tasks = Object.values(joinDataJson.tasks);
  for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
    tasks[indexTask].url = Object.keys(joinDataJson.tasks)[indexTask];
  }
  contacts = Object.values(joinDataJson.contacts);
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    contacts[indexContact].url = Object.keys(joinDataJson.contacts)[indexContact];
  }
  currentUser = joinDataJson.currentUser.userId;
}

/**
 * This function iterates through the contacts-array and finds the index of the contact of the current user
 */
function userIndexInContactsArray() {
  let userMail = users[currentUser].mail;
  indexContactUser = contacts.map(function (element) {
    return element.mail;
  }).indexOf(userMail);
}

/**
 * This function adjusts the "headerUserName" in the header to the currentUser
 */
function headerUser() {
  document.getElementById("headerUserName").innerHTML = nameAbbreviation(indexContactUser);
  if (indexContactUser == -1) {
    document.getElementById("headerUserName").innerHTML = "YOU";
  }
}

/**
 * This function removes the help-option in the header and subemenu if the user is on the help- or help_external-page
 */
function hideHelpOption() {
  document.getElementById("headerHelp").classList.add("d-none");
  document.querySelector(".hide-help-option-desktop").classList.add("d-none");
}

/**
 * This function adds the "active"-class to sidebar-link of the current page
 */
function setActiveMenuLink() {
  let location = window.location.href;
  let currentPage = (name) => {
    if (location.includes(name)) {
      return location;
    }
  }

  switch (location) {
    case currentPage("summary"):
      document.getElementById("summaryLink").classList.add("active"); break;
    case currentPage("add_task"):
      document.getElementById("addTaskLink").classList.add("active"); break;
    case currentPage("board"):
      document.getElementById("boardLink").classList.add("active"); break;
    case currentPage("contacts"):
      document.getElementById("contactsLink").classList.add("active"); break;
    case currentPage("privacy_policy"):
      document.getElementById("privacyPolicyLink").classList.add("active"); break;
    case currentPage("legal_notice"):
      document.getElementById("legalNoticeLink").classList.add("active"); break;
  }
}

/**
 * This function is used for the addUser()-, addTask()- and addContact()-function to transfer the added data to firebase
 * 
 * @param {string} path - the path, where the data should be added in firebase (users, tasks, contacts)
 * @param {object} data - an object, that contains all the key-value-pairs that should be added to firebase
 */
async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data)
  });
  await init();
  return responseToJson = await response.json();
}

/**
 * This function changes edited data in firebase
 * 
 * @param {string} path - the path, where the data should be edited in firebase
 * @param {object} data - an object, that contains all the key-value-pairs that should replace the previous object in firebase
 */
async function putData(path = "", data = {}) {
  if (document.getElementById("overviewOverlay")) {
    if (!document.getElementById("overviewOverlay").classList.contains("d-none")) {
      data = data.subtasks;
    }
  }
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data)
  });
  await init();
  return responseToJson = await response.json();
}

/**
 * This function changes edited data in firebase
 * 
 * @param {string} path - the path, where the data should be deleted in firebase
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  await init();
  return responseToJson = await response.json();
}

/**
 * This function assigns a random color of the given colors-palette
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function assignRandomColor(indexContact) {
  if (contactColors[indexContact]) { return contactColors[indexContact] }
  if (availableColors.length === 0) availableColors = [...colors];
  let randomIndex = Math.floor(Math.random() * availableColors.length);
  let assignedColor = availableColors.splice(randomIndex, 1)[0];
  contactColors[indexContact] = assignedColor;
  return assignedColor;
}

/**
 * This function changes the profile-badge-color according to the deposited color for the contact
 * 
 * @param {string} contentRef - the id of the element that should get the deposited color as the background-color
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function profileBadgeColor(contentRef, indexContact) {
  if (indexContact == -1) {
    document.getElementById(contentRef).style.backgroundColor = "#D9D9D9";
  } else {
    document.getElementById(contentRef).style.backgroundColor = contacts[indexContact].color;
  }
}

/**
 * This function extracts the first letter of the contacts first and of the contacts last name and returns them 
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array 
 */
function nameAbbreviation(indexContact) {
  if (indexContact == -1) {
    return "  "
  } else {
    let contactFullName = contacts[indexContact].name.toUpperCase();
    let contactFirstName = contactFullName.substring(0, contactFullName.indexOf(' '));
    let contactLastName = contactFullName.substring(contactFullName.indexOf(' ') + 1);
    let firstLetter = contactFirstName.charAt(0);
    let secondLetter = contactLastName.charAt(0);
    return firstLetter + secondLetter
  }
}

/**
 * This function shows the 'succesfully created/edited/deleted'-message after adding/editing/deleting a contact or task was succesfull
 * 
 * @param {number} msgId - the id of the message that should be shown
 */
async function successfullMsg(msgId) {
  let successMsg = document.getElementById(msgId);
  successMsg.classList.remove("d-none");
  successMsg.style.animationName = "msgSuccesfull";
  setTimeout(function () {
    successMsg.style.animationName = "unset";
    successMsg.classList.add("d-none");
    init();
  }, 1600);
}

/**
 * This function checks, if a required input is filled in and toggles the "requirement-unfulfilled"-class accordingly
 * 
 * @param {string} contentRefId - the id of the element that should be checked
*/
function checkFilledInput(contentRefId) {
  let contentRef = document.getElementById(contentRefId);
  if (contentRefId == "addTaskCategory") {
    checkFilledInputTaskCategory();
  } else {
    if (contentRef.value == "") {
      contentRef.classList.add("requirement-unfulfilled");
      setTimeout(function () {
        contentRef.classList.remove("requirement-unfulfilled");
      }, 2400);
    } else {
      contentRef.classList.remove("requirement-unfulfilled");
    }
  }
}

/**
 * This function checks, if a task-category is chosen and toggles the "requirement-unfulfilled"-class accordingly
*/
function checkFilledInputTaskCategory() {
  let contentRef = document.getElementById("addTaskCategory");
  if (contentRef.placeholder == "Select task category") {
    contentRef.classList.add("requirement-unfulfilled");
    setTimeout(function () {
      contentRef.classList.remove("requirement-unfulfilled");
    }, 2400);
  } else {
    contentRef.classList.remove("requirement-unfulfilled");
  }
}


/**
 * This function toggles the visibilty of the submenu (and its transparent background-overlay) onclick
 */
function toggleSubmenu() {
  document.getElementById("submenuOverlay").classList.toggle("d-none");
}

/**
 * This function redirects the user to the help.html-page and saves the link of the previous visited page in the local storage
 * 
 * @param {url} location - the url of the previous page
 */
function redirectToHelp(location) {
  localStorage.setItem("location", JSON.stringify(location));
  window.location.href = "./help.html"
}

/**
 * This function redirects the user to the help_external.html-page and saves the link of the previous visited page in the local storage
 * 
 * @param {url} location - the url of the previous page
 */
function redirectToHelpExternal(location) {
  localStorage.setItem("location", JSON.stringify(location));
  window.location.href = "./help_external.html"
}

/**
 * This function gets the link of the previous page from the local storage and redirects the user to that page (redirection to summary, if no previous page was found)
 */
function redirectToPreviousPage() {
  previousLocation = JSON.parse(localStorage.getItem("location"));
  if (previousLocation !== null) {
    window.location.href = previousLocation;
  } else {
    window.location.href = "http://127.0.0.1:5500/html/summary.html";
  }
}

/**
 * This function hides the entrie of all users except the current one
 * 
 * @param {string} contentRef - the repetetive part of the id that is used to find the element to remove
 */
function hideAllUsers(contentRef) {
  for (let indexUser = 0; indexUser < users.length - 1; indexUser++) {
    let usersInContactsIds = contacts.findIndex(index => index.name === users[indexUser].name).toString();
    let usersEntrie = document.getElementById(contentRef + usersInContactsIds);
    if (usersInContactsIds != indexContactUser) {
      usersEntrie.remove();
    }
  }
}

/**
 * This function adds the addition " (You)" to the currentUser-address book entrie
 * 
 * @param {string} contentRef - the id of the element, that should be changed
 */
function adjustUserContact(contentRef) {
  if (indexContactUser !== -1) {
    document.getElementById(contentRef + indexContactUser).innerHTML += " (You)";
  }
}

/**
 * This function checks, if the mail-input-value is a proper name. It returns the email address or shows an alert accordingly.
 * 
 * @param {string} contentRef - the id of the element
 */
function validateNameInput(contentRef) {
  let nameInput = document.getElementById(contentRef).value;
  let firstChar = Number(nameInput.charAt(0));
  if (nameInput.trim() !== "" && isNaN(firstChar)) {
    return nameInput.trim()
  } else {
    document.getElementById("alertName").classList.remove("invisible");
    setTimeout(function () {
      document.getElementById("alertName").classList.add("invisible");
    }, 2400);
    return ""
  }
}

/**
 * This function checks, if the mail-input-value is a proper email address. It returns the email address or shows an alert accordingly.
 * 
 * @param {string} contentRef - the id of the element
 */
function validateMailInput(contentRef) {
  let mailInput = document.getElementById(contentRef).value;
  let charsBetweenAtAndDot = mailInput.lastIndexOf(".") - mailInput.indexOf("@");
  if (mailInput.includes("@") && mailInput.includes(".") && mailInput.charAt(0) !== "@" && mailInput.charAt(0) !== "." && mailInput.slice(-1) !== "." & mailInput.slice(-1) !== "@" && charsBetweenAtAndDot >= 2) {
    return mailInput.toLowerCase();
  } else {
    document.getElementById("alertMail").classList.remove("invisible");
    setTimeout(function () {
      document.getElementById("alertMail").classList.add("invisible");
    }, 2400);
    return ""
  }
}

/**
 * This function checks, if a user with the same email address already exists and thus prevents a mail address from being used multiple times
 * 
 *  * @param {string} contentRef - the id of the element
 */
function checkMailAlreadyExists(contentRef) {
  if (document.getElementById(contentRef).value !== "") {
    for (let indexUser = 0; indexUser < users.length; indexUser++) {
      if (users[indexUser].mail == document.getElementById(contentRef).value) {
        document.getElementById("alertMailExists").classList.remove("invisible");
        document.getElementById(contentRef).classList.add("requirement-unfulfilled");
        setTimeout(function () {
          document.getElementById("alertMailExists").classList.add("invisible");
          document.getElementById(contentRef).classList.remove("requirement-unfulfilled");
        }, 2400);
        return true;
      }
    }
  } return false;
}