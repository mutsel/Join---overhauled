/**
 * This function closes all board-overlays and renders a fresh page ()
 */
function closeOverlays() {
    closeBoardBgOverlay()
    document.querySelectorAll(".board-overlay").forEach((element) => { element.style.animationName = "closeOverlay" });
    setTimeout(function () {
        document.querySelectorAll(".board-overlay").forEach((element) => { element.classList.add("d-none") });
        document.getElementById("addTaskOverlayContent").innerHTML = "";
        document.getElementById("editTaskOverlay").style.animationName = "unset";
    }, 600);
    document.getElementById("searchInput").value = "";
    document.getElementById("noResultSearchInput").classList.add("d-none");
    renderTasks();
    toggleMessageNoTasks();
}

/** 
 * This function opens the background overlay for board-overlays
 */
function openBoardBgOverlay() {
    document.getElementById("overviewOverlay").classList.add("d-none");
    document.getElementById("boardOverlayBg").classList.remove("d-none");
    document.querySelector("html").classList.add("no-scroll");
    document.getElementById("boardOverlayBg").style.animationName = "openBgOverlay";
}

/**
 * This function closes the background overlay for board-overlays
 */
function closeBoardBgOverlay() {
    document.querySelector("html").classList.remove("no-scroll");
    document.getElementById("boardOverlayBg").style.animationName = "closeBgOverlay";
    document.getElementById("boardOverlayBgInvisible").classList.add("d-none");
    setTimeout(function () {
        document.getElementById("boardOverlayBg").classList.add("d-none");
    }, 600);
}

/** 
 * This function fetches the main-part of the add_task.html and implementes it in the #addTaskOverlay-section
 * 
 * @param {string} overlay - the overlay, that should get the fetched html-data
 * @param {string} progress - the progress-category, where the new task should be in after submitting
 * @param {number} indexTask - the index of the task in the tasks-array
 */
async function fetchAddTask(overlay, progress, indexTask) {
    fetch('add_task.html')
        .then(response => {
            return response.text()
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            let addTaskOverlayContent = doc.querySelector('#addTask').innerHTML;
            initBoard();
            openBoardBgOverlay();
            if (overlay == "add") { openBoardAddTaskOverlay(addTaskOverlayContent, progress) }
            if (overlay == "edit") { openBoardEditTaskOverlay(addTaskOverlayContent, progress, indexTask) }
        })
}

/**
* This function is part of the fetchAddTask()-function and fills the #addTaskOverlay
* 
* @param {html} addTaskOverlayContent - the html of the main-part of the add_task.html
* @param {string} progress - the progress-category, where the new task should be added in after submitting
*/
function openBoardAddTaskOverlay(addTaskOverlayContent, progress) {
    document.getElementById("addTaskOverlay").classList.remove("d-none");
    document.getElementById("addTaskOverlay").style.animationName = "openOverlay";
    document.getElementById("addTaskOverlayContent").innerHTML = "";
    document.getElementById("addTaskOverlayContent").innerHTML = addTaskOverlayContent;
    adjustAddTaskProgress(progress);
    clearTaskForm();
    fillAssignedToDropDownMenu();
    datepickerDisablePastDates();
}

/**
* This function is part of the fetchAddTask()-function and fills the #editTaskOverlay
* 
* @param {html} addTaskOverlayContent - the html of the main-part of the add_task.html
* @param {string} progress - the progress-category, where the edited task is in after submitting
*/
function openBoardEditTaskOverlay(addTaskOverlayContent, progress, indexTask) {
    document.getElementById("overviewOverlay").classList.add("d-none");
    document.getElementById("overviewOverlayContent").innerHTML = "";
    document.getElementById("editTaskOverlay").classList.remove("d-none");
    document.getElementById("editTaskOverlay").style.animationName = "openOverlay";
    document.getElementById("editTaskOverlayContent").innerHTML = "";
    document.getElementById("editTaskOverlayContent").innerHTML = addTaskOverlayContent;
    document.getElementById("addTaskH1").innerHTML = "";
    document.getElementById("addTaskCancel").classList.add("d-none");
    document.getElementById("addTaskCreate").classList.add("d-none");
    document.querySelector(".index-task").id = indexTask;
    document.getElementById(indexTask).classList.remove("d-none");
    document.getElementById(indexTask).classList.add("progress-" + progress);
    fillEditTaskInputs(indexTask);
    fillAssignedToDropDownMenu();
    datepickerDisablePastDates()
}

/**
* This function is part of the openBoardAddTaskOverlay()-function.
* It changes the classList of the #addTaskCreate-Button, so the added task is added in the right progress-category
* 
* @param {string} progress - the progress-category, where the new task should be in after submitting
*/
function adjustAddTaskProgress(progress) {
    let addTaskCreateBtnClassList = document.getElementById("addTaskCreate").classList;
    addTaskCreateBtnClassList.remove("progress-toDo");
    addTaskCreateBtnClassList.add("progress-" + progress);
}

/**
* This function opens the overviewOverlay for the clicked task, which gives an overview over the task-information
* 
* @param {number} indexTask - the index of the task in the tasks-array
*/
function openTaskOverview(indexTask) {
    openBoardBgOverlay();
    document.getElementById("overviewOverlay").classList.remove("d-none");
    document.getElementById("overviewOverlay").style.animationName = "openOverlay";
    document.getElementById("overviewOverlayContent").innerHTML = "";
    document.getElementById("overviewOverlayContent").innerHTML += getTaskOverviewOverlayTemplate(indexTask);
    if (tasks[indexTask].priority == "") {
        document.getElementById("prioOverview" + indexTask).src = "";
    }
    fillTaskOverviewLists(indexTask);
    if (document.getElementById("overviewContact" + indexContactUser)) {
        adjustUserContact("overviewContact")
    }
}

/**
* This function is part of the openTaskOverview()-function and fills the "overviewAssignedContacts" and "overviewSubtasks" for the contact in the edit-overlay
* 
* @param {number} indexTask - the index of the task in the tasks-array
*/
function fillTaskOverviewLists(indexTask) {
    if (tasks[indexTask].assignedTo !== undefined) {
        assignedToOverviewList(indexTask);
    } else {
        document.getElementById("hideForNoAssignedTo").classList.add("d-none");
    }
    if (tasks[indexTask].subtasks !== undefined) {
        subtasksOverviewList(indexTask);
    } else {
        document.getElementById("hideForNoSubtasks").classList.add("d-none");
    }
}

/**
* This function is part of the fillTaskOverviewLists()-function and displays the assigned contacts on the board-overview-overlay
* 
* @param {number} indexTask - the index of the task in the tasks-array
*/
function assignedToOverviewList(indexTask) {
    for (let indexAssignedContact = 0; indexAssignedContact < tasks[indexTask].assignedTo.length; indexAssignedContact++) {
        let indexContact = contacts.findIndex((element) => { return element.name === tasks[indexTask].assignedTo[indexAssignedContact].name })
        document.getElementById("overviewAssignedContacts" + indexTask).innerHTML += getBoardOverviewContactPB(indexTask, indexContact);
        if (contacts[indexContact] !== undefined) {
            document.getElementById(indexTask + "contactName" + indexContact).innerHTML = contacts[indexContact].name;
        } else {
            document.getElementById(indexTask + "contactName" + indexContact).innerHTML = "You";
        }
        profileBadgeColor(indexTask + "overviewAssignedToListPB" + indexContact, indexContact)
    }
}

/**
 * This function disables past dates to get picked.
 */
function datepickerDisablePastDates() {
    let currentYear = new Date().getFullYear();
    let currentMonth = ((new Date().getMonth() + 1).toString()).padStart(2, "0");
    let currentDay = (new Date().getDate().toString()).padStart(2, "0");
    document.getElementById("addTaskDate").min = currentYear + "-" + currentMonth + "-" + currentDay;
}

/**
* This function is part of the fillTaskOverviewLists()-function and displays the subtasks on the board-overview-overlay
* 
* @param {number} indexTask - the index of the task in the tasks-array
*/
function subtasksOverviewList(indexTask) {
    for (let indexSubtask = 0; indexSubtask < tasks[indexTask].subtasks.length; indexSubtask++) {
        let subtask = tasks[indexTask].subtasks[indexSubtask].subtask;
        document.getElementById("overviewSubtasks" + indexTask).innerHTML += getBoardOverviewSubtask(subtask, indexSubtask, indexTask)
    }
}

/**
* This function is used to assign subtasks as completed
*  
* @param {number} indexSubtask - the index of the subtask in the subtasks-list
* @param {number} indexTask - the index of the task in the tasks-array
*/
async function completedSubtask(indexSubtask, indexTask) {
    let checkboxContentRef = document.getElementById("overviewCheckbox" + indexSubtask);
    checkboxContentRef.classList.toggle("checkbox-completed-false");
    checkboxContentRef.classList.toggle("checkbox-completed-true");
    await updateTaskSubtaskProgress(indexTask);
}

/**
* This function is used to assign subtasks as completed
* 
* @param {number} indexTask - the index of the task in the tasks-array
*/
async function updateTaskSubtaskProgress(indexTask) {
    let subtasksArr = [];
    for (let indexSubtask = 0; indexSubtask < tasks[indexTask].subtasks.length; indexSubtask++) {
        let checkboxContentRef = document.getElementById("overviewCheckbox" + indexSubtask);
        let completed = checkboxContentRef.className.replace("overview-checkbox checkbox-completed-", " ").trim();
        let subtask = document.getElementById("subtaskContent" + indexSubtask).innerHTML;
        subtasksArr.push({
            "completed": completed,
            "subtask": subtask
        })
    }
    putData("/tasks/" + tasks[indexTask].url + "/subtasks", {
        "subtasks": subtasksArr
    });
}

/**
 * This function fills in the inputs of the edit-task-overlay with the information of the corresponding task
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function fillEditTaskInputs(indexTask) {
    clearTaskForm();
    document.getElementById("addTaskTitle").value = tasks[indexTask].title;
    document.getElementById("addTaskDescription").value = tasks[indexTask].description;
    document.getElementById("addTaskDate").value = tasks[indexTask].dueDate;
    document.getElementById("prioMedium").classList.remove("prioMediumClicked", "clicked");
    document.getElementById("prioMediumImg").src = "../assets/prioMedium.svg";
    document.getElementById("prio" + tasks[indexTask].priority).classList.add("prio" + tasks[indexTask].priority + "Clicked");
    document.getElementById("prio" + tasks[indexTask].priority).classList.add("clicked");
    document.getElementById("prio" + tasks[indexTask].priority + "Img").src = "../assets/prio" + tasks[indexTask].priority + "_active.svg";
    document.getElementById("addTaskCategory").placeholder = tasks[indexTask].category;
    fillEditTaskFormLists(indexTask);
}

/**
 * This function is part of the fillEditTaskInputs()-function fills the "addTaskAssignedToList" and "addTaskSubtaskList" for the contact in the edit-overlay
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function fillEditTaskFormLists(indexTask) {
    if (tasks[indexTask].assignedTo !== undefined) {
        for (let indexAssignedContact = 0; indexAssignedContact < tasks[indexTask].assignedTo.length; indexAssignedContact++) {
            let indexContact = contacts.findIndex((element) => { return element.name === tasks[indexTask].assignedTo[indexAssignedContact].name });
            document.getElementById("addTaskAssignedToListContent").innerHTML += getAddTaskContactPB(indexContact);
            profileBadgeColor("addTaskAssignedToListPB" + indexContact, indexContact);
        }
    }
    if (tasks[indexTask].subtasks !== undefined) {
        for (let indexSubtask = 0; indexSubtask < tasks[indexTask].subtasks.length; indexSubtask++) {
            let subtask = tasks[indexTask].subtasks[indexSubtask].subtask;
            document.getElementById("addTaskSubtaskListContent").innerHTML += getAddTaskSubtaskTemplate(subtask, indexSubtask);
        }
        addSubtaskProgressClass(indexTask);
    }
}

/**
 * This function adds a class to each already existing subtask. The given class indicates the completed-status (true or false) for each subtask.
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function addSubtaskProgressClass(indexTask) {
    for (let indexSubtask = 0; indexSubtask < tasks[indexTask].subtasks.length; indexSubtask++) {
        let subtaskContentRef = document.getElementById("subtask" + indexSubtask);
        subtaskContentRef.classList.add("subtask-completed-" + tasks[indexTask].subtasks[indexSubtask].completed);
    }
}

/**
 * This function sends the path of the task that should be deleted to firebase
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
async function deleteTask(indexTask) {
    await deleteData("/tasks/" + tasks[indexTask].url);
    successfullMsg("taskSuccesfullyDeleted");
    closeOverlays();
    initBoard();
}