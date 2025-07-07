// Store all tasks
var tasks = []

// Track which task is being edited or deleted
var editIndex = null;
var deleteIndex = null;

// Get and format today's date
var now = new Date();
var formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});

// Show current date on page
document.getElementById("currentDate").textContent = formattedDate;

// Load tasks from local storage if available
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    displayTasks();
}

// Add new task
function addTask() {
    var input = document.getElementById("input");
    var inputValue = input.value.trim();
    var dueDate = document.getElementById("dueDate");
    var dueDateValue = dueDate.value.trim();
    var priority = document.getElementById("priority");
    var priorityValue = priority.value.trim();

    if (inputValue !== "") {
        // Add task to list
        tasks.push({
            status: "Not Started",
            description: inputValue,
            dueDate: dueDateValue,
            priority: priorityValue
        });

        // Save tasks
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Clear input fields
        input.value = "";
        dueDate.value = "";
        priority.value = "";

        // Hide error message if showing
        message.classList.add("d-none");

        // Show updated list
        displayTasks();
    } else {
        // Show alert if description is empty
        var message = document.getElementById("noTaskMessage");
        message.classList.remove("d-none");
        setTimeout(() => {
            message.classList.add("d-none")
        }, 3000);
    }
}

// Show tasks on the table
function displayTasks(taskArray = tasks) {
    var list = document.getElementById("list");
    list.innerHTML = "";

    if (taskArray.length === 0) {
        // Show message if no tasks
        list.innerHTML = `
        <tr>
            <td colspan="5" class="text-center text-muted">No tasks found. Please review or adjust your filter selections.</td>
        </tr
        `;
    }

    // Add each task to table
    taskArray.forEach((task, index) => {
        var row = `
        <tr>
            <td>${task.status}</td>
            <td class="align-middle">${task.description}</td>
            <td class="align-middle">${task.dueDate}</td>
            <td class="align-middle">${task.priority}</td>
            <td class="text-end align-middle">
            <div class="d-inline-flex gap-2">
                <a data-bs-toggle="modal" data-bs-target="#editModal" onclick="openEditModal(${index})"><i class="bi bi-pencil-square"></i></a>
                <a style="color: red" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="openDeleteModal(${index})"><i class="bi bi-trash3 pe-2"></i></a>
            </div>
            </td>
        </tr>`;
        list.innerHTML += row;
    })
}

// Load task data into edit modal
function openEditModal(index) {
    editIndex = index;
    var task = tasks[index];

    document.getElementById("editStatus").value = task.status;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editDueDate").value = task.dueDate;
    document.getElementById("editPriority").value = task.priority;
}

// Save edited task
function saveTaskChanges() {
    var newDescription = document.getElementById("editDescription").value.trim();
    var newStatus = document.getElementById("editStatus").value;
    var newDueDate = document.getElementById("editDueDate").value;
    var newPriority = document.getElementById("editPriority").value;

    if (editIndex !== null && newDescription) {
        var existingTask = tasks[editIndex];

        // Update task info
        tasks[editIndex] = {
            status: newStatus || existingTask.status,
            description: newDescription,
            dueDate: newDueDate || existingTask.dueDate,
            priority: newPriority || existingTask.priority
        };

        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
    }
}

// Load task info into delete confirmation modal
function openDeleteModal(index) {
    deleteIndex = index;
    var task = tasks[index];

    document.getElementById("deleteTask").textContent = task.description;
}

// Remove task from list
function deleteTask() {
    if (deleteIndex !== null) {
        tasks.splice(deleteIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        displayTasks();
        deleteIndex = null;
    }
}

// Filter tasks by priority or due date
function filterTask() {
    var priority = document.getElementById("filterPriority").value;
    var dueDate = document.getElementById("filterDueDate").value;

    if (priority === "All" && dueDate === "all") {
        displayTasks();
        return;
    }

    var today = new Date();
    var filteredTasks = tasks.filter((task) => {
        let matchPriority = true;
        let matchDueDate = true;

        if (priority !== "All") {
            matchPriority = task.priority === priority || task.status === priority;
        }

        if (dueDate !== "All") {
            var taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            switch (dueDate) {
                case "today":
                    matchDueDate = taskDate.getTime() === today.getTime();
                    break;
                case "tomorrow":
                    var tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    matchDueDate = taskDate.getTime() === tomorrow.getTime();
                    break;
                case "this_week":
                    var endOfWeek = new Date(today);
                    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                    matchDueDate = taskDate.getTime() === endOfWeek.getTime();
                    break;
                case "overdue":
                    matchDueDate = taskDate < today;
                    break;
            }
        }

        return matchDueDate && matchPriority;
    });

    displayTasks(filteredTasks);
}
