let tasksToDo = 0;
let tasksInProgress = 0;
let tasksAwaitFeedback = 0;
let tasksDone = 0;

/**
 * This function is the inital function, when summary.html is loading and executes the init()-function and furher necessary summary-functions
 */
async function initSummary() {
    await init();
    tasksToDo = 0;
    tasksInProgress = 0;
    tasksAwaitFeedback = 0;
    tasksDone = 0;
    showTasksNumbers();
    showNextDeadline()
    greetingDaytime();
}

/** 
 * This function fills the according tasks-numbers in the different "counterTasks"-container
 */
function showTasksNumbers() {
    countTasksInProgressCategories();
    document.getElementById("counterTasksTotal").innerHTML = tasks.length;
    document.getElementById("counterTasksToDo").innerHTML = tasksToDo;
    document.getElementById("counterTasksDone").innerHTML = tasksDone;
    document.getElementById("counterTasksInProgress").innerHTML = tasksInProgress;
    document.getElementById("counterTasksAwaitingFeedback").innerHTML = tasksAwaitFeedback;
    let urgentTasks = 0;
    for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
        if (tasks[indexTask].priority == "Urgent") {
            urgentTasks++;
        }
    }
    document.getElementById("counterTasksUrgent").innerHTML = urgentTasks;
}

/**  
 * This function iterates through the task progresses of the tasks-array and counts up the according task-progress-number
 */
function countTasksInProgressCategories() {
    for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
        let taskProgress = tasks[indexTask].progress.progress;
        switch (taskProgress) {
            case "toDo": tasksToDo++; break;
            case "inProgress": tasksInProgress++; break;
            case "awaitFeedback": tasksAwaitFeedback++; break;
            case "done": tasksDone++; break;
        }
    }
}

/**
 * This function sorts out, wich of the tasks dueDate values is the closest to the current date and fills in the "nextDeadline"-container accordingly
 */
function showNextDeadline() {
    let today = new Date();
    let deadlines = [];
    for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
        let tasksDeadline = tasks[indexTask].dueDate;
        deadlines.push(new Date(tasksDeadline));
    }
    let upCommingDeadline = deadlines.reduce((upCommingDeadline, date) =>
        Math.abs(date - today) < Math.abs(upCommingDeadline - today) ? date : upCommingDeadline
    );
    let upCommingDeadlineMonth = upCommingDeadline.toLocaleString('en-us', { month: 'long' });
    let upCommingDeadlineDay = upCommingDeadline.getDate();
    let upCommingDeadlineYear = upCommingDeadline.getFullYear();
    document.getElementById("nextDeadline").innerHTML = upCommingDeadlineMonth + " " + upCommingDeadlineDay + ", " + upCommingDeadlineYear;
}

/**
 * This function uses the daytime-hours-number to choose the appropriate greeting according to the time of the day and displays it
 */
function greetingDaytime() {
    const greetingContentRef = document.getElementById("greetingDaytime");
    let daytime = new Date().getHours();
    let greeting = (daytime >= 3 && daytime <= 12) ? "Good morning," :
        ((daytime >= 13 && daytime <= 18) ? "Good afternoon," : "Good evening,");
    greetingContentRef.innerHTML = greeting;
    showUserName();
}

/**
 * This function displays the name of the current user and redirects to the guestGreeting()-function if the user used the guest-login
 */
function showUserName() {
    let userNameContentRef = document.getElementById("greetinguserName");
    userNameContentRef.innerHTML = "";
    if (indexContactUser == -1) {
        guestGreeting();
    } else {
        userNameContentRef.innerHTML = users[currentUser].name;
    }
}

/**
 * This function removes the comma from the the current Greeting
 */
function guestGreeting() {
    const greetingContentRef = document.getElementById("greetingDaytime");
    let originallyGreeting = greetingContentRef.innerHTML;
    let newGreeting = originallyGreeting.replace(",", " ").trim();
    if (window.innerWidth <= 1000 && !greetingContentRef.innerHTML.includes("!")) {
        greetingContentRef.innerHTML = newGreeting + "!";
    } else {
        greetingContentRef.innerHTML = newGreeting.replace("!", " ").trim();
    }
}

/**
 * This function redirects the user to the board-page
 */
function redirectionToBoard() {
    window.location.href = "../html/board.html";
}