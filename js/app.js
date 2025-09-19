const formulario = document.getElementById("formulario");
const list = document.getElementById("list");
let tasks = [];

eventListeners();

function eventListeners() {
    formulario.addEventListener("submit", addTask);

    // Load localStorage when DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        createHTML();

        // When the DOM loads, we pass the tasks array to check if there are any
        updateCounter(tasks);
    });
}

function addTask(e) {

    e.preventDefault();

    const formTask = document.getElementById("task").value;

    if (formTask.trim() === "") {
        showError("A task cannot be empty", e.target.parentElement);
        return;
    }

    // Passed validation
    const taskObj = {
        id: Date.now(),
        status: false,
        formTask
    }

    tasks = [...tasks, taskObj];

    createHTML();

    formulario.reset();

    updateCounter(tasks);

}

function showError(error, reference) {

    // Delete error message if already exists
    const message = reference.querySelector(".error-container");

    if (message) {
        message.remove();
    }

    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");

    const errorElement = document.createElement("p");
    errorElement.textContent = error;
    errorElement.classList.add("error");

    errorContainer.appendChild(errorElement);

    const content = document.querySelector(".contenedor");
    content.appendChild(errorContainer);

    setTimeout(() => {
        errorContainer.remove();
    }, 3000);

}

function createHTML() {

    // avoid repeated tasks
    cleanHTML();

    if (tasks.length > 0) {

        const taskBox = document.createElement("ul");
        taskBox.classList.add("task-box");

        tasks.forEach(task => {

            const li = document.createElement("li");
            li.classList.add("task-items")

            const checkButton = document.createElement("input");
            checkButton.type = "checkbox";
            checkButton.checked = task.status;

            const textElement = document.createElement("span");
            textElement.classList.add("task-textElement");
            textElement.textContent = task.formTask;

            if (task.status) {
                textElement.style.textDecoration = "line-through";
            }

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("task-closeElement");
            deleteButton.textContent = "X";

            checkButton.onchange = () => {

                if (checkButton.checked) {
                    textElement.style.textDecoration = "line-through";
                    task.status = true;

                } else {
                    textElement.style.textDecoration = "none";
                    task.status = false;

                }
                // Save task status in localStorage
                synchStorage();

                // Update DOM Counter
                const LS_tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                updateCounter(LS_tasks);

            }

            deleteButton.onclick = () => {
                deleteTask(task.id);

                // Update DOM Counter
                const LS_tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                updateCounter(LS_tasks);
            }


            li.appendChild(checkButton);
            li.appendChild(textElement);
            li.appendChild(deleteButton);

            taskBox.appendChild(li);
        });

        list.appendChild(taskBox);
    }

    // Save tasks in localStorage
    synchStorage();

}

function synchStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    createHTML();
}

function changeStatus(task) {

    if (task.status === false) {
    }

}

// Counter functionality
function updateCounter(tasks) {

    let tasksPending = [];
    let tasksCompleted = [];

    tasksPending = tasks.filter(task => task.status === false);

    tasksCompleted = tasks.filter(task => task.status === true);

    const counterPendingTasks = document.getElementById('numPendientes');
    const counterCompletedTasks = document.getElementById('numCompletadas');

    counterPendingTasks.textContent = tasksPending.length;
    counterCompletedTasks.textContent = tasksCompleted.length;

}

function cleanHTML() {

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

}