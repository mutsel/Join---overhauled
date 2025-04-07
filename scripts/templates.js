/**
 * This template displays the users profile in the add-task-assigned-to-dropdown-menu
 *  
 * @param {number} indexUser - the index of the user in the contacts-array
 */
function getAddTaskDropdownListUserOption(indexUser) {
    return `<div onclick="contactAssigned('assignedToUserOption', ${indexUser})" id="assignedToUserOption${indexUser}" class="dropdown-option user-option flex align-center just-space-b">
                <div class="flex align-center">
                    <div id="assignedToPB${indexUser}" class="profile-badge">${nameAbbreviation(indexUser)}</div>
                    <span>You</span>
                </div>
                <div id="assignedToCheckbox${indexUser}" class="dropdown-option-checkbox"></div>
            </div>`
}

/** 
 * This template displays a contact in the add-task-assigned-to-dropdown-menu
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getAddTaskDropdownListContacts(indexContact) {
    return `<div onclick="contactAssigned('assignedToOption', ${indexContact})" id="assignedToOption${indexContact}" class="dropdown-option flex align-center just-space-b">
                <div class="flex align-center">
                    <div id="assignedToPB${indexContact}" class="profile-badge">${nameAbbreviation(indexContact)}</div>
                    <span>${contacts[indexContact].name}</span>
                </div>
                <div id="assignedToCheckbox${indexContact}" class="dropdown-option-checkbox"></div>
            </div>`
}

/**
 * This template displays a contacts profile badge in the add-task-assigned-to-list
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getAddTaskContactPB(indexContact) {
    return `<div id="addTaskAssignedToListPB${indexContact}" class="profile-badge assigned-contact">${nameAbbreviation(indexContact)}</div>`
}

/**
 * This template creates an entrie for the subtasks-list in the add-task-form
 * 
 * @param {string} subtask - the content of the currently added subtask
 * @param {number} indexSubtask - the index of the subtask in the subtasks-list
 */
function getAddTaskSubtaskTemplate(subtask, indexSubtask) {
    return `<div ondblclick="editSubtask(${indexSubtask})" id="subtask${indexSubtask}" class="subtask flex align-center just-space-b">
            ${getAddTaskSubtaskListElementTemplate(subtask, indexSubtask)}
            </div>`
}

/**
 * This template displays the content of a subtask in a list element.
 * 
 * @param {string} subtask - the content of the currently added/edited subtask
 * @param {number} indexSubtask - the index of the subtask in the subtasks-list
 */
function getAddTaskSubtaskListElementTemplate(subtask, indexSubtask) {
    return `<li class="subtask-content">${subtask}</li>
            <div class="subtask-list-icons">
                <img onclick="editSubtask(${indexSubtask})" class="subtask-icon" src="../assets/edit.svg">
                <div class="subtask-icons-seperator"></div>
                <img onclick="deleteSubtask(${indexSubtask})" class="subtask-icon" src="../assets/delete.svg">
            </div>`
}

/**
 * This template displays the content of a subtask in an input.
 * 
 * @param {string} subtask - the content of the currently clicked subtask
 * @param {number} indexSubtask - the index of the subtask in the subtasks-list
 */
function getAddTaskSubtaskEditTemplate(subtask, indexSubtask) {
    return `<input id="subtaskEditInput" class="subtask-edit-input" value="${subtask}">
            <div class="subtask-edit-icons flex">
                <img onclick="deleteSubtask(${indexSubtask})" class="subtask-icon" src="../assets/delete.svg">
                <div class="subtask-icons-seperator"></div>
                <img onclick="confirmEditSubtask(${indexSubtask})" class="subtask-icon" src="../assets/create_dark.svg">
            </div>`
}

// /**
//  * This template includes a button to close board's overlays
//  */
// function getBoardCloseBtnTemplate() {
//     return `<img onclick="closeOverlays()" src="../assets/cancel.svg" class="overlay-close"></img>`
// }

/**
 * This template creates a (by default invisible) marked area, where a dragged element can be released. Ondragover it becomes visible.
 * 
 * @param {string} contentRefId - the id of the possible drop area
 */
function getBoardDropDownAreaTemplate(contentRefId) {
    return `<div id="dropdownArea${contentRefId}" class="dropdown-area d-none">
                <div ondrop="drop(event)" ondragover="event.preventDefault()" ondragenter="showDropdownArea('${contentRefId}')"></div>
            </div>`
}


/**
 * This template creates a task-card with some information vor a task
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function getBoardTaskTemplate(indexTask) {
    return `<section class="task-card">
                <div id="moveTaskMenuMobile${indexTask}" class="move-task-menu-mobile"></div>
                <div class="task-card-content flex column" id="task${indexTask}" draggable="true" ondragstart="drag(event)" ondragend="hideDropdownAreas()" onclick="openTaskOverview(${indexTask})">
                    <div class="flex just-space-b">
                        <div class="task-category category-${(tasks[indexTask].category.toLowerCase()).replace(' ', '-')}">${tasks[indexTask].category}</div>
                        <img onclick="moveTaskProgressMobile(${indexTask}); event.stopImmediatePropagation()" src="../assets/board_move_task_menu_mobile.svg" alt="->" id="moveProgressMobile${indexTask}" class="move-task-menu-mobile-btn">
                    </div>
                    <div class="task-title">${tasks[indexTask].title}</div>
                    <div class="task-description">${tasks[indexTask].description}</div>
                    <div id="boardProgressSubtask${indexTask}" class="task-progress flex align-center">
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width:${progressSubtasksPercentage(indexTask)}%;"></div>
                        </div>
                        <span>${countCompletedSubtasks(indexTask)}/${countTotalSubtasks(indexTask)} Subtasks</span>
                    </div>
                    <div class="assigned-contacts-and-priority flex align-center just-space-b">
                        <div id="assignedContacts${indexTask}" class="task-assigned-contacts flex"></div>
                        <div id="assignedContactsAdditionBoard${indexTask}" class="assigned-contacts-addition profile-badge profile-badge-small d-none flex">+<p id="assignedContactsAdditionNumberBoard${indexTask}">0</p></div>
                        <img id="prio${indexTask}" src="../assets/prio${tasks[indexTask].priority}.svg">
                    </div>
                </div>
            </section>`
}

/**
 * This template displays a contacts profile badge on the board's task-card
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getBoardContactPB(indexTask, indexContact) {
    return `<div id="${indexTask}boardAssignedToListPB${indexContact}" class="assigned-contact-board${indexTask} profile-badge">${nameAbbreviation(indexContact)}</div>`
}
 
/**
 * This template creates an overlay that lets the user choose, to which progress-category a task should move for mobile screens.
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function getBoardTaskMoveProgressMobile(indexTask) {
    return `<div onclick="event.stopImmediatePropagation()" id="moveProgressMobileMenu${indexTask}" class="move-task-menu-content flex column">
                <p class="move-task-title">Move to</p>
                <div class="move-task-options flex column">
                    <p onclick="updateTaskProgress('toDo', ${indexTask}), closeOverlays()" class="move-task-option flex align-center">
                        <img id="moveProgressToDo${indexTask}" src="../assets/arrow_backwards.svg" class="arrow-backwards">
                        <span>To-Do</span>
                    </p>
                    <p onclick="updateTaskProgress('inProgress', ${indexTask}), closeOverlays()" class="move-task-option flex align-center">
                        <img id="moveProgressInProgress${indexTask}" src="../assets/arrow_backwards.svg" class="arrow-backwards">
                        <span>In Progress</span>
                    </p>
                    <p onclick="updateTaskProgress('awaitFeedback', ${indexTask}), closeOverlays()" class="move-task-option flex align-center">
                        <img id="moveProgressAwaitFeedback${indexTask}" src="../assets/arrow_backwards.svg" class="arrow-backwards">
                        <span>Await Feedback</span>
                    </p>
                    <p onclick="updateTaskProgress('done', ${indexTask}), closeOverlays()" class="move-task-option flex align-center">
                        <img id="moveProgressDone${indexTask}" src="../assets/arrow_backwards.svg" class="arrow-backwards">
                        <span>Done</span>
                    </p>
                </div>
            </div>`
}

/**
 * This template displays a task in a larger view showing all its necessary information
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function getTaskOverviewOverlayTemplate(indexTask) {
    return `<div class="overview-header flex align-center just-space-b">
                <div class="task-category category-${(tasks[indexTask].category.toLowerCase()).replace(' ', '-')} flex align-center">${tasks[indexTask].category}</div>
                <img onclick="closeOverlays()" src="../assets/cancel.svg" class="overlay-close"></img>
            </div>
            <p class="overview-title">${tasks[indexTask].title}</p>
            <div class="overview-description">${tasks[indexTask].description}</div>
            <div class="overview-info flex">
                <span>Due Date:</span>
                <p>${tasks[indexTask].dueDate}</p>
            </div>
            <div class="overview-info flex">
                <span>Priority:</span>
                <p>${tasks[indexTask].priority}<img id="prioOverview${indexTask}" src="../assets/prio${tasks[indexTask].priority}.svg"></p>
            </div>
            <div id="hideForNoAssignedTo" class="overview-info flex">Assigned To:</div>
            <div id="overviewAssignedContacts${indexTask}" class="overview-contacts flex column">
            </div>
            <div id="assignedContactsAdditionBoardOverview" class="assigned-contacts-addition-overview profile-badge d-none flex">+<p id="assignedContactsAdditionNumberBoardOverview">0</p></div>
            <div id="hideForNoSubtasks" class="overview-info flex">Subtasks:</div>
            <div id="overviewSubtasks${indexTask}" class="overview-subtasks"></div>
            <div class="edit-delete-btns">
                <button onclick="deleteTask(${indexTask})"> 
                    <div class="edit-delete-btn-icon delete-icon"></div> Delete
                </button>
                <div class="btns-seperator"></div>
                <button onclick="openEditTaskOverlay('${tasks[indexTask].progress.progress}', ${indexTask})">
                    <div class="edit-delete-btn-icon edit-icon"></div> Edit
                </button>
            </div>`
}

/**
 * This template displays a contacts profile badge on the board's task-overview-overlay
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getBoardOverviewContactPB(indexTask, indexContact) {
    return `<div id="overviewContact${indexContact}" class="assigned-contact flex align-center">
                <div id="${indexTask}overviewAssignedToListPB${indexContact}" class="profile-badge">${nameAbbreviation(indexContact)}</div>
                <p id="${indexTask}contactName${indexContact}"></p>
            </div>`
}

/**
 * This template displays a contacts profile badge on the board's task-overview-overlay
 * 
 * @param {string} subtask - the content of the current subtask
 * @param {number} indexSubtask - the index of the subtask in the subtasks-list
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function getBoardOverviewSubtask(subtask, indexSubtask, indexTask) {
    return `<div onclick="completedSubtask(${indexSubtask}, ${indexTask})" id="overviewAssignedSubtask${indexSubtask}" class="assigned-subtask flex align-center">
                <div id="overviewCheckbox${indexSubtask}" class="overview-checkbox checkbox-completed-${tasks[indexTask].subtasks[indexSubtask].completed}"></div>
                <p id="subtaskContent${indexSubtask}">${subtask}</p>
            </div>`
}

/**
 * This template creates the necessary button for the editTask-overlay for the board
 * 
 * @param {number} indexTask - the index of the task in the tasks-array
 */
function getBoardEditTaskBtnTemplate(indexTask) {
    return `<button id="editTaskOk" onclick="saveEditTask(${indexTask}); return false"
                class="blue-btn">
                Ok
                <img src='../assets/create_light.svg'>
            </button>`
}

/**
 * This template creates an address book entrie for a contact
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getAddressbookContactTemplate(indexContact) {
    return `<div id="id${indexContact}" class="contact flex" onclick="contactClicked(${indexContact})">
                <div id="profileBadge${indexContact}" class="profile-badge">${nameAbbreviation(indexContact)}</div>
                <p class="flex">
                    <span id="idName${indexContact}" class="contact-name">${contacts[indexContact].name}</span>
                    <span class="contact-mail">${contacts[indexContact].mail}</span>
                </p>
            </div>`
}

/**
 * This template creates an overlay for the focused-contact-area with the current contacts information
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getFocusedContactTemplate(indexContact) {
    return `<div class="focused-profile-overview flex align-center">
                <div id="focusedProfileBadge" class="focused-profile-badge">${nameAbbreviation(indexContact)}</div>
                <div class="focused-profile-account">
                    <span id="idFocusedName${indexContact}" class="focused-contact-name">${contacts[indexContact].name}</span>
                    <div class="edit-delete-btns">
                        <button onclick="openContactsOverlay(), adjustOverlayToEdit(${indexContact})">
                         <div class="edit-delete-btn-icon edit-icon"></div>
                            <span>Edit</span>
                        </button>
                        <button id="deleteBtnContacts" onclick="deleteContact(${indexContact})">
                            <div id="contactsDeleteIcon" class="edit-delete-btn-icon delete-icon"></div>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="focused-profile-information">
                <p>Contact Information</p>
                <div class="flex just-space-b">
                    <span class="contact-opportunity">Email</span>
                    <span class="contact-mail">${contacts[indexContact].mail}</span>
                </div>
                <div class="flex just-space-b">
                    <span class="contact-opportunity">Phone</span>
                    <span>${contacts[indexContact].phone}</span>
                </div>
            </div>`
}

/**
 * This template creates the two necessary buttons for the contacts-overlay 'Add contact'
 */
function getContactsOverlayAddBtnsTemplate() {
    return `<button onclick="clearContactForm(); return false" class="white-btn cancel-btn-hide-mobile" id="contactsOverlayCancel">
                Cancel
                <div class="cancel-btn-icon"></div>
            </button>
            <button id="contactsOverlayCreate" onclick="addContact(); return false"
                class="blue-btn">
                Create Contact
                <img src="../assets/create_light.svg">
            </button>`
}

/**
 * This template creates the two necessary buttons for the contacts-overlay 'Edit contact'
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getContactsOverlayEditBtnsTemplate(indexContact) {
    return `<button onclick="clearContactForm(); return false" class="white-btn" id="contactsOverlayDelete">
                Clear
                <div class="cancel-btn-icon"></div>
            </button>
            <button id="contactsOverlaySave" onclick="saveEditContact(${indexContact}); return false"
                class="blue-btn">
                Save
                <img src='../assets/create_light.svg'>
            </button>`
}

/** 
 * This template creates the two necessary buttons for the "btnsMenuMobile" to edit or delete a contact
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function getContactsMenuMobileTemplate(indexContact) {
    return `<button onclick="openContactsOverlay(), adjustOverlayToEdit(${indexContact}), toggleEditDeleteMenuMobile()" class="edit-delete-btns">
                <div class="edit-delete-btn-icon edit-icon"></div>
                <span>Edit</span>
            </button>
            <button id="deleteBtnContacts" onclick="deleteContact(${indexContact}), toggleEditDeleteMenuMobile()" class="focused-contact-btns">
                <div class="edit-delete-btn-icon delete-icon"></div>
                <span>Delete</span>
            </button>`
}