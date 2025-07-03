var tasks = [];
var editIndex = null;
var deleteIndex = null;
var now = new Date();
var formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
})

document.getElementById("currentDate").textContent = formattedDate;

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

function addTask() {
    var input = document.getElementById("inputTask");
    var inputValue = input.value.trim();

    if (inputValue !== "") {
        tasks.push({ status: "Not Started", description: inputValue })
        localStorage.setItem("tasks", JSON.stringify(tasks));
        input.value = "";
        displayTasks();
    }
}

function displayTasks(taskArray = tasks) {
    var list = document.getElementById("list");
    list.innerHTML = "";

    if (taskArray.length === 0) {
        list.innerHTML = `
        <tr>
            <td colspan="3" class="text-center text-muted">No tasks available!</td>
        </tr>
        `;
    }

    taskArray.forEach((task, index) => {
        var row = `
        <tr>
            <td>${task.status}</td>
            <td>${task.description}</td>
            <td class="text-end">
                <div class="d-inline-flex gap-2">
                    <a data-bs-toggle="modal" data-bs-target="#editModal" onclick="openEditModal(${index})">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <a style="color: red" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="openDeleteModal(${index})">
                        <i class="bi bi-trash3 pe-2"></i>
                    </a>
                </div>
            </td>
        </tr>
        `;
        list.innerHTML += row;
    })
}

function openEditModal(index) {
    editIndex = index;

    var task = tasks[index];
    document.getElementById("taskDescription").value = task.description;

    var select = document.querySelector("#editForm select");
    select.value = task.status;

}

function saveTaskChanges() {
    var newDescription = document.getElementById("taskDescription").value;
    var newStatus = document.querySelector("#editForm select").value;

    if (editIndex !== null && newDescription.trim() !== "") {
        tasks[editIndex].description = newDescription;
        tasks[editIndex].status = newStatus;

        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    }
}
displayTasks();

function openDeleteModal(index) {
    deleteIndex = index;

    var task = tasks[index];
    document.getElementById("deleteTask").textContent = task.description;
}

function deleteTask() {
    if (deleteIndex !== null) {
        tasks.splice(deleteIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
        deleteIndex = null;
    }
}

function filterTask() {
    var filter = document.querySelector("#inputGroupSelect").value;

    if (filter === "All") {
        displayTasks();
    } else {
        var filteredTasks = tasks.filter(task => task.status === filter);
        displayTasks(filteredTasks);
    }
}
