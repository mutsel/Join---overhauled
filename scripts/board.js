/**
 * This function is the inital function, when board.html is loading and executes the init()-function and further necessary board-functions
 */
async function initBoard() {
  await init();
  clearTaskProgressCategories();
  renderTasks();
  toggleMessageNoTasks();
}

/**
 * This function clears each of the progress-catergories
 */
function clearTaskProgressCategories() {
  document.getElementById("toDo").innerHTML = "";
  document.getElementById("inProgress").innerHTML = "";
  document.getElementById("awaitFeedback").innerHTML = "";
  document.getElementById("done").innerHTML = "";
}
 
/** 
 * This function creates a task-card for each task in its corresponding progress-category
 */
function renderTasks() {
  clearTaskProgressCategories();
  for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
    let taskProgress = tasks[indexTask].progress.progress;
    let taskProgressContentRef = document.getElementById(taskProgress);
    taskProgressContentRef.innerHTML += getBoardTaskTemplate(indexTask);
    hideSubtasksProgressForNoSubtasks(indexTask);
    displayAssignedContacts(indexTask);
    if (tasks[indexTask].priority == "") {
      document.getElementById("prio" + indexTask).src = "";
    }
  }
  renderDropdownAreas();
  toggleMoveTaskMenuMobileBtn();
}

/**
 * This function adds the dropdown-areas (only visible ondrag) to the progress-categories
 */
function renderDropdownAreas() {
  document.getElementById("toDo").innerHTML += getBoardDropDownAreaTemplate("toDo");
  document.getElementById("inProgress").innerHTML += getBoardDropDownAreaTemplate("inProgress");
  document.getElementById("awaitFeedback").innerHTML += getBoardDropDownAreaTemplate("awaitFeedback");
  document.getElementById("done").innerHTML += getBoardDropDownAreaTemplate("done");
}

/** 
 * This function calculates the progress of the subtasks of a task in percents
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function progressSubtasksPercentage(indexTask) {
  let totalSubtasks = countTotalSubtasks(indexTask);
  let completedSubtasks = countCompletedSubtasks(indexTask);
  if (totalSubtasks !== 0) {
    return (completedSubtasks / totalSubtasks) * 100;
  } else {
    return 0;
  }
}

/**
 * This function counts the number of subtasks of a task and returns the value
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function countTotalSubtasks(indexTask) {
  let tasksSubtasks = tasks[indexTask].subtasks;
  let totalSubtasks = 0;
  if (tasksSubtasks !== undefined) {
    totalSubtasks = tasksSubtasks.length;
  }
  return totalSubtasks;
}

/**
 * This function counts the number of completed subtasks of a task and returns the value
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function countCompletedSubtasks(indexTask) {
  let tasksSubtasks = tasks[indexTask].subtasks;
  let completedSubtasks = 0;

  if (tasksSubtasks !== undefined) {
    for (let indexSubtask = 0; indexSubtask < tasksSubtasks.length; indexSubtask++) {
      if (tasksSubtasks[indexSubtask].completed == "true") {
        completedSubtasks++;
      }
    }
  }
  return completedSubtasks;
}

/**
 * This function displays the assigned contacts for a task
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function displayAssignedContacts(indexTask) {
  let assignedContactsContentRef = document.getElementById("assignedContacts" + indexTask);
  assignedContactsContentRef.innerHTML = "";
  let assignedContacts = tasks[indexTask].assignedTo;
  if (assignedContacts !== undefined) {
    for (let indexAssignedContact = 0; indexAssignedContact < assignedContacts.length; indexAssignedContact++) {
      let indexContact = contacts.findIndex(index => index.name === assignedContacts[indexAssignedContact].name);
      assignedContactsContentRef.innerHTML += getBoardContactPB(indexTask, indexContact);
      profileBadgeColor(indexTask + "boardAssignedToListPB" + indexContact, indexContact);
    }
  }
  shortAssignedToListBoard(indexTask)
}

/**
 * This function checks the number of assigned to contacts for a task. If there are more than five contacts, only the first five are shown and the other ones are hidden.
 * The user can see how many more contacts are assigned.
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function shortAssignedToListBoard(indexTask) {
  let numberAssignedContacts = document.querySelectorAll(".assigned-contact-board" + indexTask);
  document.getElementById("assignedContactsAdditionNumberBoard" + indexTask).innerHTML = (numberAssignedContacts.length - 5);
  if (numberAssignedContacts.length > 5) {
    for (let indexAssignedContact = 5; indexAssignedContact < numberAssignedContacts.length; indexAssignedContact++) {
      numberAssignedContacts[indexAssignedContact].classList.add("d-none");
    }
    document.getElementById("assignedContactsAdditionBoard" + indexTask).classList.remove("d-none");
  } else {
    for (let indexAssignedContact = 0; indexAssignedContact < numberAssignedContacts.length; indexAssignedContact++) {
      numberAssignedContacts[indexAssignedContact].classList.remove("d-none");
    }
    document.getElementById("assignedContactsAdditionBoard" + indexTask).classList.add("d-none");
  }
}

/**
 * This function hides the representation of the subtasks-progress, if a task has no subtasks assigned
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function hideSubtasksProgressForNoSubtasks(indexTask) {
  if (tasks[indexTask].subtasks == undefined) {
    document.getElementById("boardProgressSubtask" + indexTask).classList.add("d-none");
  }
}

/**
 * This function checks if a task-category contains tasks and toggles the 'no task'-message accordingly
 */
function toggleMessageNoTasks() {
  const taskProgressCategories = document.querySelectorAll(".board-tasks-list");
  for (let indexProgressCategory = 0; indexProgressCategory < taskProgressCategories.length; indexProgressCategory++) {
    let taskProgressContentRef = document.getElementsByClassName("board-tasks-list")[indexProgressCategory];
    let noTaskMessagesContentRef = document.getElementsByClassName("no-task-message")[indexProgressCategory];
    if (taskProgressContentRef.querySelectorAll(".task-card-content").length == 0) {
      noTaskMessagesContentRef.classList.remove("d-none");
    } else {
      noTaskMessagesContentRef.classList.add("d-none");
    }
  }
}

/**
 * This function checks if the searchInput contains three or more characters. If so, it executes the displayFilteredTasks()-function
 * If not, it fills the progress-categories with the corresponding tasks.
 */
function startSearchingTasks() {
  let searchInputRef = document.getElementById("searchInput");
  clearTaskProgressCategories();
  searchInputRef.disabled = true;
  if (searchInputRef.value.toLowerCase().length >= 3) {
    displayFilteredTasks(searchInputRef.value.toLowerCase());
  } else {
    clearTaskProgressCategories();
    renderTasks();
    document.getElementById("noResultSearchInput").classList.add("d-none");
    document.querySelector("html").classList.remove("no-scroll");
  }
  searchInputRef.disabled = false;
  searchInputRef.focus();
  toggleMessageNoTasks();
}

/**
* This function fills the progress-categories with the filtered elements.
* 
* @param {string} searchInput - the value of the searchInputRef
*/
function displayFilteredTasks(searchInput) {
  filterTasks(searchInput);
  for (let indexTask = 0; indexTask < filteredTasks.length; indexTask++) {
    if (filteredTasks[indexTask] != 0) {
      document.getElementById(tasks[indexTask].progress.progress).innerHTML += getBoardTaskTemplate(indexTask);
      hideSubtasksProgressForNoSubtasks(indexTask);
      displayAssignedContacts(indexTask);
      if (tasks[indexTask].priority == "") {
        document.getElementById("prio" + indexTask).src = "";
      }
      toggleMoveTaskMenuMobileBtn();
    }
  }
  showNoResultsAlert()
}

/**
* This function shows the "no result matches the search criteria"-message if no tasks could have been found.
*/
function showNoResultsAlert() {
  if (document.querySelectorAll(".task-card-content").length == 0) {
    document.getElementById("noResultSearchInput").classList.remove("d-none");
    document.querySelector("html").classList.add("no-scroll");
  }
}

/**
* This function filters those tasks from the tasks-array, whose title or description contain the searchInput
* 
* @param {string} searchInput - the value of the searchInputRef
*/
function filterTasks(searchInput) {
  filteredTasks = [];
  for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
    let tasksTitle = tasks[indexTask].title.toLowerCase();
    let tasksDescription = tasks[indexTask].description.toLowerCase();
    if (tasksTitle.includes(searchInput) || tasksDescription.includes(searchInput)) {
      filteredTasks.push(tasks[indexTask]);
    } else {
      filteredTasks.push(0)
    }
  }
}

/**
 * This function gives all dropdown-areas the "d-none"-class
 */ 
function hideDropdownAreas() {
  document.querySelectorAll(".dropdown-area").forEach((element) => {element.classList.add("d-none")});
}

/**
 * shows the position, where the elemnt would be visible if the user drops it
 * 
 * @param {string} contentRefId - the id of the possible drop area
 */
function showDropdownArea(contentRefId) {
  hideDropdownAreas();
  let dropDownArea = document.getElementById("dropdownArea" + contentRefId);
  dropDownArea.classList.remove("d-none");

}

/**
 * Sets the dragged element's id in the dataTransfer object
 * 
 * @param {DragEvent} event - the drag event
 */
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}


/**
 * Handles the drop event by moving the dragged task to a new column and updating its progress
 * 
 * @param {DragEvent} event - the drop event
 */
function drop(event) {
  event.preventDefault();
  event.stopPropagation();
  hideDropdownAreas();
  let data = event.dataTransfer.getData("text");
  let draggedElement = document.getElementById(data);
  let dropContainer = event.target.closest(".board-tasks-list");
  if (dropContainer.contains(draggedElement) == false) {
    let indexTask = draggedElement.id.replace("task", " ").trim();
    updateTaskProgress(dropContainer.id, indexTask);
    dropContainer.innerHTML += draggedElement.outerHTML;
    draggedElement.remove();
  }
}
 
/**
 * This function checks, if the progress of a task had changed.
 * If yes, it updates the data in firebase
 * 
 * @param {string} progress - the progress of the task (toDo, inProgress, awaitFeedback, done)
 * @param {number} indexTask - the index of the task in the tasks-array
 */
async function updateTaskProgress(progress, indexTask) {
  if (tasks[indexTask].progress !== progress) {
    await putData("/tasks/" + tasks[indexTask].url + "/progress", {
      "progress": progress
    });
    initBoard();
    toggleMessageNoTasks();
  }
}

/** 
 * This function toggles the visibility of the "move-task-menu-mobile-btn", depending if the user uses a mobile device or not
 */
function toggleMoveTaskMenuMobileBtn() {
  let userDevice = navigator.userAgent.toLowerCase();  
  if (userDevice.includes('mobil') || userDevice.includes('tablet')) {
    document.querySelectorAll(".move-task-menu-mobile-btn").forEach((element) => {element.classList.remove("d-none")})
  } else {
    document.querySelectorAll(".move-task-menu-mobile-btn").forEach((element) => {element.classList.add("d-none")})
  }
}

/**
 * This function lets users with mobile devices move a task to another progress-category by opening a menu
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function openMoveTaskProgressMobile(indexTask) {
  document.getElementById("boardOverlayBgInvisible").classList.remove("d-none");
  document.querySelector("html").classList.add("no-scroll");
  document.getElementById("moveTaskMenuMobile" + indexTask).innerHTML += getBoardTaskMoveProgressMobile(indexTask);
  document.getElementById("task" + indexTask).style.transform = "rotateZ(-5deg)";
  document.getElementById("taskCard" + indexTask).style.zIndex = "6";
}