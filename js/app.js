// Variables
const formulario = document.getElementById("formulario");
const list = document.getElementById("list");
let tasks = [];

// Eventos
eventListeners();

function eventListeners () {
    formulario.addEventListener("submit", addTask);

    // Load localStorage when DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        createHTML();
    });
}

function addTask (e) {
    e.preventDefault();

    const formTask = document.getElementById("task").value;

    if(formTask.trim() === "") {
        showError("A task cannot be empty", e.target.parentElement);
        return;
    }

    // Passed validation
    const taskObj = {
        id: Date.now(),
        formTask
    }

    tasks = [...tasks, taskObj];

    createHTML();

    formulario.reset();
    

}

function showError (error, reference) {
    
    // Delete error message if already exists
    const message = reference.querySelector(".error-container");

    if(message) {
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

    if(tasks.length > 0) {
        tasks.forEach(task => {

            const taskBox = document.createElement("div");
            taskBox.classList.add("task-box");

            const li = document.createElement("li");
            li.classList.add("task-textElement");
            li.textContent = task.formTask;

            const deleteButton = document.createElement("a");
            deleteButton.classList.add("task-closeElement");
            deleteButton.textContent = "X";

            deleteButton.onclick = () => {
                deleteTask(task.id);
            }

            taskBox.appendChild(li);
            taskBox.appendChild(deleteButton);

            list.appendChild(taskBox);
        });
    }

    // Save tasks in localStorage
    synchStorage();

}

function synchStorage () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask (taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    createHTML();
}

function cleanHTML() {
    
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }

}