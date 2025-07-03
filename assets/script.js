var tasks = [];

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

function addTask() {
    var input = document.getElementById("inputTask");
    var inputValue = input.value.trim();

    if (inputValue !== "") {
        tasks.push({ status: "Not started", description: inputValue })
        localStorage.setItem("tasks", JSON.stringify(tasks));
        input.value = "";
        displayTasks();
    }
}

function displayTasks() {
    var list = document.getElementById("list");
    list.innerHTML = "";

    tasks.forEach(function (task, index) {
        var row = `
        <tr>
            <td>${task.status}</td>
            <td>${task.description}</td>
            <td class="text-end">
                <div class="d-inline-flex gap-2">
                    <a data-bs-toggle="modal" data-bs-target="#editModal">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <a style="color: red" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <i class="bi bi-trash3 pe-2"></i>
                    </a>
                </div>
            </td>
        </tr>
        `;
        list.innerHTML += row;
    })
}

displayTasks();