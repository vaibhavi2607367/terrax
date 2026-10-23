const form = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const subject = document.getElementById("subject");
const deadline = document.getElementById("deadline");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem("studyTasks") || "[]"
  );

  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.name === "string" &&
      typeof task.subject === "string" &&
      typeof task.deadline === "string" &&
      typeof task.done === "boolean"
    );
  }
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function updateSummary() {
  document.getElementById("total").textContent = tasks.length;

  document.getElementById("pending").textContent =
    tasks.filter(task => !task.done).length;

  document.getElementById("completed").textContent =
    tasks.filter(task => task.done).length;
}

function renderTasks() {
  taskList.replaceChildren();

  const visibleTasks = tasks.filter(task => {
    if (filter.value === "pending") return !task.done;
    if (filter.value === "completed") return task.done;
    return true;
  });

  emptyMessage.hidden = visibleTasks.length > 0;

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = task.done ? "task done" : "task";

    const title = document.createElement("strong");
    title.textContent = task.name;

    const details = document.createElement("p");
    details.textContent =
      "Subject: " + task.subject +
      " | Deadline: " + task.deadline;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.textContent = task.done
      ? "Mark pending"
      : "Mark completed";

    toggleButton.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.append(toggleButton, deleteButton);
    item.append(title, details, actions);
    taskList.appendChild(item);
  });

  updateSummary();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskName.value.trim();
  const subjectName = subject.value.trim();
  const dueDate = deadline.value;

  if (!name || !subjectName || !dueDate) return;

  tasks.push({
    id: Date.now() + Math.random(),
    name: name,
    subject: subjectName,
    deadline: dueDate,
    done: false
  });

  saveTasks();
  renderTasks();

  form.reset();
  taskName.focus();
});

filter.addEventListener("change", renderTasks);

renderTasks();