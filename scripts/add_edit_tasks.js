/**
 * This function reads out the data of the add-task-form and adds the task to tasks-array and firebase
 */
function addTask() {
    if (requirementsFullfilled()) {
        postData("/tasks/", {
            "title": document.getElementById("addTaskTitle").value,
            "description": document.getElementById("addTaskDescription").value,
            "assignedTo": getAssignedContacts(),
            "dueDate": checkDateInput(),
            "priority": getTaskPriority(),
            "category": checkTaskCategory(),
            "subtasks": getSubtasks(),
            "progress": { "progress": getAddProgress() }
        });
        currentPageFunctions();
    } else { requirementsUnfullfilled() }
}

/**
 * This function checks if the required add-task-inputs are filled and returns true respectively false accordingly
 */
function requirementsFullfilled() {
    if (document.getElementById("addTaskTitle").value !== "" &&
        document.getElementById("addTaskDate").value !== "" &&
        checkDateInput() !== false &&
        document.getElementById("addTaskCategory").placeholder !== "Select task category") {
        return true;
    } else {
        checkDateInput();
        return false;
    }
}

/**
 * This function is part of the addTask()-function and if a task-category is selected and returns it
 */
function checkTaskCategory() {
    let taskCategory = document.getElementById("addTaskCategory").placeholder;
    if (taskCategory !== "Select task category") {
        return taskCategory;
    }
}

/**
 * This function is part of the addTask()-function and creates and returns an array with all the assigned contacts in the assigned-contacts-list
 */
function getAssignedContacts() {
    let assignedContactsList = document.querySelectorAll(".assigned-contact");
    let assignedContactsIndexArray = [];
    let assignedContactsArray = [];
    for (let indexAssignedContact = 0; indexAssignedContact < assignedContactsList.length; indexAssignedContact++) {
        let assignedContactId = assignedContactsList[indexAssignedContact].id.replace("addTaskAssignedToListPB", " ").trim();
        assignedContactsIndexArray.push(assignedContactId);
        if (assignedContactId == -1) {
            getAssignedContactsUser(assignedContactsArray);
        } else {
            assignedContactsArray.push(contacts[assignedContactsIndexArray[indexAssignedContact]]);
        }
    }
    return assignedContactsArray;
}

/**
 * This function checks if the picked date is valide (not in the past)
 */
function checkDateInput() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let dateInput = new Date(document.getElementById("addTaskDate").value);
    dateInput.setHours(0, 0, 0, 0);
    if (document.getElementById("addTaskDate").value == "") {
        checkFilledInput("addTaskDate");
    } else {
        if (dateInput - today >= 0) {
            return document.getElementById("addTaskDate").value
        }
        else { 
            dateInputInvalid();
            return false; 
        }
    }
}

function dateInputInvalid() {
    document.getElementById("alertAddTaskDate").classList.remove("invisible");
    document.getElementById("addTaskDate").classList.add("requirement-unfulfilled");
    setTimeout(function () {
        document.getElementById("alertAddTaskDate").classList.add("invisible");
        document.getElementById("addTaskDate").classList.remove("requirement-unfulfilled");
    }, 2400);
}

/**
 * This function adds the user (if assigned) to the assignedContactsArray for a task
 * 
 * @param {Array} assignedContactsArray - the array for the contacts that are assigned for a task
 */
function getAssignedContactsUser(assignedContactsArray) {
    assignedContactsArray.push({
        "color": "#D9D9D9",
        "mail": "",
        "name": "",
        "phone": ""
    });
}

/**
 * This function returns the chosen priority for a task
 */
function getTaskPriority() {
    let clickedPriority = document.querySelector(".clicked");
    if (clickedPriority == null) {
        return "";
    } else {
        return clickedPriority.innerText;
    }
}

/**
 * This function is part of the addTask()-function and creates and returns an array with all the subtasks in the subtask-list
 */
function getSubtasks() {
    let subtasks = document.querySelectorAll(".subtask-content");
    let subtasksArray = [];
    for (let indexSubtask = 0; indexSubtask < subtasks.length; indexSubtask++) {
        subtasksArray.push({
            "subtask": subtasks[indexSubtask].innerHTML,
            "completed": false
        })
    }
    return subtasksArray;
}

/**
 * This function is part of the addTask()-function and returns the progress-category, where the new task should be added
 */
function getAddProgress() {
    let progressContentRef = document.getElementById("addTaskCreate").classList[1];
    switch (progressContentRef) {
        default:
        case "progress-toDo": return "toDo"
        case "progress-inProgress": return "inProgress"
        case "progress-awaitFeedback": return "awaitFeedback"
    }
}

/**
 * This function executes different functions depending on the current page (board or add task)
 */
function currentPageFunctions() {
    if (window.location.href.includes("board")) {
        boardOnlyFunctions();
    } else {
        document.getElementById("addTaskCategory").classList.remove("requirement-unfulfilled");
        successfullMsg("addTaskTaskSuccesfullyCreated");
        setTimeout(function () {
            window.location.href = "./board.html";
        }, 1600);
    }
}

/**
 * This function is part of the saveEditTask()-function and shows alerts and userfeedback for not filled in inputs
 */
function requirementsUnfullfilled() {
    checkFilledInput("addTaskTitle");
    checkFilledInput("addTaskDate");
    checkFilledInput("addTaskCategory");
    document.getElementById("alertAddTask").classList.remove("invisible");
    setTimeout(function () {
        document.getElementById("alertAddTask").classList.add("invisible");
    }, 2400);
}

/**
 * This function lets the user save changes for a task, wich are used tot edit the data in firebase and the tasks-array
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function saveEditTask(indexTask) {
    if (requirementsFullfilled()) {
        putData("/tasks/" + tasks[indexTask].url, {
            "title": document.getElementById("addTaskTitle").value,
            "description": document.getElementById("addTaskDescription").value,
            "assignedTo": getAssignedContacts(),
            "dueDate": document.getElementById("addTaskDate").value,
            "priority": getTaskPriority(),
            "category": checkTaskCategory(),
            "subtasks": getSubtasks(),
            "progress": { "progress": getEditProgress() }
        });
        boardOnlyFunctions();
    } else { requirementsUnfullfilled() }
}

/**
 * This function is part of the saveEditTask()-function and returns the progress-category, where the edited task is in
 */
function getEditProgress() {
    switch (document.getElementById("editTaskOk").classList[1]) {
        default:
        case "progress-toDo": return "toDo"
        case "progress-inProgress": return "inProgress"
        case "progress-awaitFeedback": return "awaitFeedback"
        case "progress-done": return "done"
    }
}

/**
 * This function is part of the saveEditTask()-function. It checks, if the board.html is the current page and executes corresponding functions
 */
async function boardOnlyFunctions() {
    successfullMsg("taskSuccesfullyEdited");
    setTimeout(function () {
        initBoard();
        closeOverlays();
    }, 1600);
}